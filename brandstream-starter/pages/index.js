
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';

export default function BrandStreamApp() {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generateBrandPersona = async () => {
    setLoading(true);
    const prompt = `Generate a U.S. market brand persona for a Chinese manufacturer.\nProduct: ${product}\nTarget Audience: ${audience}\nInclude: brand name, tagline, tone, competitor comparisons, suggested messaging.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      setOutput(data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching GPT response:', error);
      setOutput('Failed to generate brand persona. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(output, 180);
    doc.text(lines, 10, 10);
    doc.save(`BrandPersona_${product}.pdf`);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">BrandStream – U.S. Brand Generator</h1>
      <Card className="mb-6">
        <CardContent className="space-y-4">
          <Input placeholder="What product are you selling?" value={product} onChange={(e) => setProduct(e.target.value)} />
          <Input placeholder="Who is your U.S. target audience?" value={audience} onChange={(e) => setAudience(e.target.value)} />
          <Button onClick={generateBrandPersona} disabled={loading}>{loading ? 'Generating…' : 'Generate Brand Persona'}</Button>
        </CardContent>
      </Card>
      {output && (
        <Card>
          <CardContent className="space-y-4">
            <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
            <Button onClick={exportPDF}>Download PDF</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
