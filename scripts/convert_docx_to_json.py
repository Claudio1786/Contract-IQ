#!/usr/bin/env python3
"""
Convert .docx boilerplate templates to JSON fixture format.

Usage:
    python convert_docx_to_json.py <input.docx> <output.json>
    python convert_docx_to_json.py --batch <directory>
"""

import argparse
import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

try:
    from docx import Document
except ImportError:
    print("ERROR: python-docx not installed. Run: pip install python-docx")
    exit(1)


def extract_text_from_docx(file_path: str) -> tuple[str, List[Dict[str, str]]]:
    """
    Extract text and sections from a .docx file.
    
    Returns:
        tuple: (full_text, sections_list)
    """
    doc = Document(file_path)
    full_text = []
    sections = []
    current_section = None
    current_section_text = []
    
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
            
        full_text.append(text)
        
        # Detect section headers (numbered or bold)
        if re.match(r'^\d+\.?\s+[A-Z]', text) or (para.style and para.style.name and para.style.name.startswith('Heading')):
            # Save previous section
            if current_section:
                sections.append({
                    "title": current_section,
                    "text": "\n".join(current_section_text)
                })
            # Start new section
            current_section = text
            current_section_text = []
        elif current_section:
            current_section_text.append(text)
    
    # Save last section
    if current_section:
        sections.append({
            "title": current_section,
            "text": "\n".join(current_section_text)
        })
    
    return "\n\n".join(full_text), sections


def infer_contract_type(filename: str, content: str) -> str:
    """Infer contract type from filename and content."""
    filename_lower = filename.lower()
    content_lower = content.lower()
    
    type_map = {
        'nda': 'NDA',
        'non-disclosure': 'NDA',
        'confidentiality': 'NDA',
        'msa': 'MSA',
        'master service': 'MSA',
        'dpa': 'DPA',
        'data processing': 'DPA',
        'sow': 'SOW',
        'statement of work': 'SOW',
        'saas': 'SaaS',
        'subscription': 'SaaS',
        'consulting': 'Consulting',
        'professional services': 'Professional Services',
        'license': 'License',
        'vendor': 'Vendor',
        'employment': 'Employment',
        'partnership': 'Partnership',
        'reseller': 'Reseller'
    }
    
    for keyword, contract_type in type_map.items():
        if keyword in filename_lower or keyword in content_lower:
            return contract_type
    
    return 'General'


def extract_parties(content: str, sections: List[Dict]) -> List[Dict[str, str]]:
    """Extract party information from contract."""
    parties = []
    
    # Look for "Party A", "Party B", "Client", "Vendor", etc.
    party_patterns = [
        r'(Client|Customer|Buyer|Purchaser)',
        r'(Vendor|Supplier|Seller|Provider|Company)',
        r'(Disclosing Party|Receiving Party)',
        r'(Employer|Employee)',
        r'(Licensor|Licensee)'
    ]
    
    found_parties = set()
    for pattern in party_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        found_parties.update([m for m in matches])
    
    # Create party entries
    for idx, party_name in enumerate(sorted(found_parties)[:2]):
        parties.append({
            "name": party_name,
            "role": f"party-{idx+1}"
        })
    
    # Default if no parties found
    if not parties:
        parties = [
            {"name": "Party A", "role": "party-1"},
            {"name": "Party B", "role": "party-2"}
        ]
    
    return parties


def extract_key_clauses(sections: List[Dict], contract_type: str) -> List[Dict]:
    """Extract key clauses from sections."""
    clauses = []
    
    # Common clause categories
    category_keywords = {
        'obligation': ['obligation', 'duty', 'must', 'shall', 'require'],
        'carveout': ['exception', 'exclusion', 'carve', 'not include'],
        'liability': ['liability', 'indemnity', 'damages'],
        'termination': ['termination', 'cancel', 'end', 'expire'],
        'payment': ['payment', 'fee', 'compensation', 'price'],
        'ip': ['intellectual property', 'ownership', 'copyright', 'patent'],
        'confidentiality': ['confidential', 'proprietary', 'trade secret']
    }
    
    for idx, section in enumerate(sections[:10]):  # Limit to first 10 sections
        text = section.get('text', '')
        title = section.get('title', '')
        
        if not text or len(text) < 50:
            continue
        
        # Determine category
        category = 'general'
        for cat, keywords in category_keywords.items():
            if any(keyword in text.lower() or keyword in title.lower() for keyword in keywords):
                category = cat
                break
        
        clauses.append({
            "id": f"clause-{idx+1}",
            "category": category,
            "section": title,
            "text": text[:500],  # Truncate long text
            "benchmarkPercentile": 50,
            "riskPosture": "standard"
        })
    
    return clauses


def convert_to_fixture_json(docx_path: str, template_id: str) -> Dict[str, Any]:
    """
    Convert a .docx file to Contract IQ fixture JSON format.
    """
    # Extract content
    full_text, sections = extract_text_from_docx(docx_path)
    
    # Get filename
    filename = os.path.basename(docx_path)
    
    # Infer contract details
    contract_type = infer_contract_type(filename, full_text)
    parties = extract_parties(full_text, sections)
    clauses = extract_key_clauses(sections, contract_type)
    
    # Build JSON structure matching nda-simple.json format
    fixture = {
        "metadata": {
            "template": template_id,
            "version": "2025.11",
            "vertical": "general",
            "jurisdiction": "United States",
            "source": "boilerplate",
            "source_file": filename,
            "renewal": {
                "type": "fixed",
                "termMonths": 12,
                "noticeDays": 30
            },
            "counterparties": parties
        },
        "financials": None,
        "clauses": clauses,
        "risks": [
            {
                "id": "risk-001",
                "severity": "low",
                "title": "Boilerplate Template",
                "description": "This is a standard boilerplate template requiring customization for specific use cases.",
                "mitigation": "Review and customize all sections before execution.",
                "confidence": 0.85
            }
        ],
        "obligations": [
            {
                "party": "party-1",
                "action": "comply-with-terms",
                "deadline": None,
                "recurring": True,
                "condition": "during term"
            }
        ],
        "negotiation": {
            "playbook": [
                {
                    "topic": "Term Negotiation",
                    "current": "Standard terms",
                    "target": "Favorable terms",
                    "fallback": "Market standard",
                    "impact": "medium",
                    "confidence": 0.80,
                    "talking_points": [
                        "Review industry benchmarks",
                        "Assess risk allocation",
                        "Consider long-term relationship"
                    ],
                    "risk_callouts": [
                        "Ensure all terms are clearly defined"
                    ]
                }
            ]
        },
        "content": {
            "full_text": full_text,
            "sections": sections
        },
        "audit": {
            "confidence": 0.75,
            "extractedAt": datetime.utcnow().isoformat() + "Z",
            "model": "docx-converter-v1",
            "reviewRequired": True,
            "note": "Automated conversion from boilerplate template"
        }
    }
    
    return fixture


def main():
    parser = argparse.ArgumentParser(description='Convert .docx templates to JSON fixtures')
    parser.add_argument('input', help='Input .docx file or directory')
    parser.add_argument('output', nargs='?', help='Output .json file (optional for batch mode)')
    parser.add_argument('--batch', action='store_true', help='Process all .docx files in directory')
    parser.add_argument('--output-dir', help='Output directory for batch mode', default='.')
    
    args = parser.parse_args()
    
    if args.batch:
        # Batch mode: process all .docx files
        input_dir = Path(args.input)
        output_dir = Path(args.output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        docx_files = list(input_dir.glob('*.docx'))
        print(f"Found {len(docx_files)} .docx files in {input_dir}")
        
        for docx_file in docx_files:
            # Skip temp files
            if docx_file.name.startswith('~$'):
                continue
            
            # Generate template ID
            template_id = docx_file.stem.lower().replace(' ', '-').replace('_', '-')
            
            # Output filename
            output_file = output_dir / f"{template_id}.json"
            
            print(f"\nProcessing: {docx_file.name}")
            print(f"  â†’ {output_file.name}")
            
            try:
                fixture = convert_to_fixture_json(str(docx_file), template_id)
                
                # Write JSON
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(fixture, f, indent=2, ensure_ascii=False)
                
                print(f"  âœ… Converted successfully")
                print(f"     Type: {fixture['metadata'].get('template', 'unknown')}")
                print(f"     Sections: {len(fixture.get('content', {}).get('sections', []))}")
                print(f"     Clauses: {len(fixture.get('clauses', []))}")
            except Exception as e:
                print(f"  âŒ Error: {e}")
    
    else:
        # Single file mode
        if not args.output:
            print("ERROR: Output file required for single file mode")
            exit(1)
        
        docx_path = args.input
        json_path = args.output
        
        # Generate template ID from filename
        template_id = Path(docx_path).stem.lower().replace(' ', '-').replace('_', '-')
        
        print(f"Converting: {docx_path}")
        print(f"  â†’ {json_path}")
        
        try:
            fixture = convert_to_fixture_json(docx_path, template_id)
            
            # Write JSON
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(fixture, f, indent=2, ensure_ascii=False)
            
            print("[OK] Conversion successful!")
            print(f"   Type: {fixture['metadata'].get('template', 'unknown')}")
            print(f"   Sections: {len(fixture.get('content', {}).get('sections', []))}")
            print(f"   Clauses: {len(fixture.get('clauses', []))}")
        except Exception as e:
            print(f"âŒ Error: {e}")
            exit(1)


if __name__ == '__main__':
    main()


