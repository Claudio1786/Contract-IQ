import type { Config } from 'tailwindcss';

/**
 * Contract IQ Design System - Tailwind Configuration
 * Based on Flow AI dark infra aesthetic
 */
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Background colors - Dark navy base
        background: {
          primary: '#0A0E1A',
          secondary: '#111827',
          tertiary: '#1F2937',
        },
        
        // Accent colors - Blue primary
        accent: {
          primary: '#3B82F6',
          'primary-hover': '#2563EB',
          secondary: '#8B5CF6',
          cyan: '#06B6D4',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        
        // Text colors - Light hierarchy
        text: {
          primary: '#F9FAFB',
          secondary: '#E5E7EB',
          tertiary: '#9CA3AF',
          quaternary: '#6B7280',
        },
        
        // Border colors
        border: {
          primary: 'rgba(255, 255, 255, 0.1)',
          secondary: 'rgba(255, 255, 255, 0.05)',
          accent: 'rgba(59, 130, 246, 0.2)',
        },
        
        // Status colors
        status: {
          'success-bg': 'rgba(16, 185, 129, 0.1)',
          'success-text': '#10B981',
          'success-border': 'rgba(16, 185, 129, 0.3)',
          'pending-bg': 'rgba(245, 158, 11, 0.1)',
          'pending-text': '#F59E0B',
          'pending-border': 'rgba(245, 158, 11, 0.3)',
          'error-bg': 'rgba(239, 68, 68, 0.1)',
          'error-text': '#EF4444',
          'error-border': 'rgba(239, 68, 68, 0.3)',
        },
      },
      
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        'display': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h1': ['48px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
      },
      
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      
      maxWidth: {
        'container': '1280px',
      },
      
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.2)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.3)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.4)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.5)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.6)',
        'primary': '0 4px 12px rgba(59, 130, 246, 0.3)',
        'accent': '0 4px 12px rgba(139, 92, 246, 0.3)',
      },
      
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;