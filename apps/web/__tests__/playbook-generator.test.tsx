import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlaybookGenerator } from '../components/playbooks/PlaybookGenerator';
import { negotiationIntelligenceDB } from '../lib/negotiation-intelligence';

describe('PlaybookGenerator', () => {
  const mockOnPlaybookGenerated = vi.fn();

  beforeEach(() => {
    mockOnPlaybookGenerated.mockClear();
    global.fetch = vi.fn();
  });

  describe('Template Selection', () => {
    it('should render without crashing', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      expect(screen.getByText(/Generate Negotiation Playbook/i)).toBeInTheDocument();
    });

    it('should handle SLA Enhancement template selection', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      expect(screen.getByDisplayValue('Service Contract')).toBeInTheDocument();
      expect(screen.getByDisplayValue('sla_enhancement')).toBeInTheDocument();
    });

    it('should handle multiple template clicks without crashing', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Click SLA Enhancement
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      // Click Liability Caps
      const liabilityButton = screen.getByText(/Liability Caps/i);
      fireEvent.click(liabilityButton);

      // Should not crash and should show the latest template
      expect(screen.getByDisplayValue('Service Agreement')).toBeInTheDocument();
      expect(screen.getByDisplayValue('liability_cap_negotiation')).toBeInTheDocument();
    });

    it('should display objectives for selected scenario', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      // Check that objectives are displayed
      const intelligence = negotiationIntelligenceDB.sla_enhancement;
      intelligence.objectives.forEach(objective => {
        expect(screen.getByText(objective.title)).toBeInTheDocument();
      });
    });

    it('should show empty state when scenario has no objectives', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Manually select a scenario (bypassing template buttons)
      const scenarioSelect = screen.getByLabelText(/Negotiation Scenario/i);
      fireEvent.change(scenarioSelect, { target: { value: 'invalid_scenario' } });

      // Should show empty state message
      expect(screen.getByText(/No objectives available for this scenario/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable generate button when form is incomplete', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      expect(generateButton).toBeDisabled();
    });

    it('should enable generate button when form is complete', async () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Fill out form
      const contractTypeSelect = screen.getByLabelText(/Contract Type/i);
      fireEvent.change(contractTypeSelect, { target: { value: 'Service Contract' } });

      const scenarioSelect = screen.getByLabelText(/Negotiation Scenario/i);
      fireEvent.change(scenarioSelect, { target: { value: 'sla_enhancement' } });

      // Select an objective
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      expect(generateButton).not.toBeDisabled();
    });

    it('should show required fields message', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      expect(screen.getByText(/Contract type, scenario, and objectives are required/i)).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('should call API with correct payload on generate', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            playbook: {
              id: 'test-123',
              title: 'Test Playbook',
              content: 'Test content'
            }
          })
        })
      ) as any;
      global.fetch = mockFetch;

      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Use SLA template
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      // Select an objective
      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      // Click generate
      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/generate-playbook',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
        );
      });
    });

    it('should handle 503 errors with retry logic', async () => {
      let callCount = 0;
      const mockFetch = vi.fn(() => {
        callCount++;
        if (callCount <= 2) {
          return Promise.resolve({ ok: false, status: 503 } as any);
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            playbook: { id: 'test', title: 'Success', content: 'Content' }
          })
        } as any);
      });
      global.fetch = mockFetch;

      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Use template and generate
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      fireEvent.click(generateButton);

      // Should show retry indicator
      await waitFor(() => {
        expect(screen.getByText(/Retrying/i)).toBeInTheDocument();
      });

      // Should eventually succeed
      await waitFor(() => {
        expect(mockOnPlaybookGenerated).toHaveBeenCalled();
      }, { timeout: 10000 });

      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should show error with support contact after max retries', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({ ok: false, status: 503 } as any)
      );
      global.fetch = mockFetch;

      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Use template and generate
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      fireEvent.click(generateButton);

      // Should show error and support contact
      await waitFor(() => {
        expect(screen.getByText(/Failed to generate playbook/i)).toBeInTheDocument();
        expect(screen.getByText(/Contact Support/i)).toBeInTheDocument();
      }, { timeout: 15000 });

      expect(mockFetch).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    });
  });

  describe('All Quick Templates', () => {
    const templates = [
      { name: 'SaaS Renewal', scenario: 'saas_renewal_price_increase' },
      { name: 'SLA Enhancement', scenario: 'sla_enhancement' },
      { name: 'GDPR DPA', scenario: 'gdpr_dpa_compliance' },
      { name: 'Liability Caps', scenario: 'liability_cap_negotiation' },
      { name: 'Exit Rights', scenario: 'termination_exit_rights' },
      { name: 'Payment Terms', scenario: 'payment_terms_optimization' },
      { name: 'IP Rights', scenario: 'ip_rights_protection' },
      { name: 'Volume Discounts', scenario: 'volume_discount_optimization' }
    ];

    templates.forEach(template => {
      it(`should load ${template.name} template without errors`, () => {
        render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
        
        const templateButton = screen.getByText(new RegExp(template.name, 'i'));
        fireEvent.click(templateButton);

        // Should show objectives for this scenario
        const intelligence = negotiationIntelligenceDB[template.scenario as keyof typeof negotiationIntelligenceDB];
        if (intelligence?.objectives?.[0]) {
          expect(screen.getByText(intelligence.objectives[0].title)).toBeInTheDocument();
        }
      });
    });

    it('should handle rapid sequential template clicks', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      templates.forEach(template => {
        const templateButton = screen.getByText(new RegExp(template.name, 'i'));
        fireEvent.click(templateButton);
      });

      // Should not crash and should show the last template
      expect(screen.getByDisplayValue('volume_discount_optimization')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes during generation', async () => {
      const mockFetch = vi.fn(() =>
        new Promise(resolve => {
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({
              success: true,
              playbook: { id: 'test', title: 'Test', content: 'Content' }
            })
          }), 100);
        })
      ) as any;
      global.fetch = mockFetch;

      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Use template
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      fireEvent.click(generateButton);

      // Check aria-busy attribute
      expect(generateButton).toHaveAttribute('aria-busy', 'true');
    });

    it('should have focus rings on interactive elements', () => {
      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      expect(generateButton.className).toContain('focus:ring');
    });
  });

  describe('Error State Management', () => {
    it('should clear error when user changes objectives', async () => {
      const mockFetch = vi.fn(() =>
        Promise.resolve({ ok: false, status: 503 } as any)
      );
      global.fetch = mockFetch;

      render(<PlaybookGenerator onPlaybookGenerated={mockOnPlaybookGenerated} />);
      
      // Generate error
      const slaButton = screen.getByText(/SLA Enhancement/i);
      fireEvent.click(slaButton);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
      });

      const generateButton = screen.getByRole('button', { name: /Generate Negotiation Strategy/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/Failed to generate playbook/i)).toBeInTheDocument();
      }, { timeout: 15000 });

      // Change objectives
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[1]);

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/Failed to generate playbook/i)).not.toBeInTheDocument();
      });
    });
  });
});
