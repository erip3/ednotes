import React, { useState, useEffect, useMemo } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { DFA, NFA, JS } from 'refa';

interface DFADemoProps {
  takesInput?: boolean;
  regex?: string;
}

function dfaToCytoscapeElements(dfa: DFA) {
  const nodesArr = Array.from(dfa.nodes());
  const idMap = new Map<any, string>();
  nodesArr.forEach((n, i) => idMap.set(n, `q${i}`));

  // Node elements
  const nodeElements = nodesArr.map((n) => ({
    data: {
      id: idMap.get(n)!,
      label: idMap.get(n)!,
      isAccept: dfa.finals.has(n),
    },
    classes: dfa.finals.has(n) ? 'accept' : '',
  }));

  // Edge elements (grouped by CharSet)
  const edgeElements = nodesArr.flatMap((from) => {
    const map = from.out.invert(dfa.maxCharacter); // Map<targetNode, CharSet>
    const arr: any[] = [];
    for (const [to, charSet] of map.entries()) {
      const label = charSet.toUnicodeString();
      arr.push({
        data: {
          source: idMap.get(from)!,
          target: idMap.get(to)!,
          label,
        },
      });
    }
    return arr;
  });

  return [...nodeElements, ...edgeElements];
}

export const DFADemo = ({ takesInput = true, regex = '1*0' }: DFADemoProps) => {
  const [inputRegex, setInputRegex] = useState(regex);
  const [dfa, setDfa] = useState<DFA | null>(null);

  useEffect(() => {
    try {
      const parsed = JS.Parser.fromLiteral(
        typeof inputRegex === 'string' ? new RegExp(inputRegex) : inputRegex,
      ).parse();
      const { expression, maxCharacter } = parsed;
      // Build NFA using builder pattern
      const nfa = NFA.fromRegex(expression, { maxCharacter });
      const newDfa = DFA.fromFA(nfa);
      setDfa(newDfa);
    } catch (error) {
      console.error('Error parsing regex:', error);
      setDfa(null);
    }
  }, [inputRegex]);

  const elements = useMemo(
    () => (dfa ? dfaToCytoscapeElements(dfa) : []),
    [dfa],
  );

  return (
    <div>
      {takesInput ? (
        <div
          style={{
            marginBottom: '1rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <input
            value={inputRegex}
            onChange={(e) => setInputRegex(e.target.value)}
            placeholder="Enter regex"
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Regular Expression:</strong> <code>{regex}</code>
        </div>
      )}

      {dfa ? (
        <CytoscapeComponent
          elements={elements}
          style={{ width: '600px', height: '400px', border: '1px solid #ccc' }}
          layout={{ name: 'breadthfirst' }}
          stylesheet={[
            {
              selector: 'node.accept',
              style: {
                'background-color': '#4caf50',
                'border-width': 3,
                'border-color': '#333',
              },
            },
            {
              selector: 'node',
              style: {
                label: 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'background-color': '#2196f3',
                color: '#fff',
                'font-weight': 'bold',
              },
            },
            {
              selector: 'edge',
              style: {
                label: 'data(label)',
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                width: 2,
                'line-color': '#888',
                'target-arrow-color': '#888',
                'font-size': 12,
                'text-background-color': '#fff',
                'text-background-opacity': 1,
                'text-background-padding': 2,
              },
            },
          ]}
        />
      ) : (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          DFA could not be generated for this regular expression.
        </div>
      )}
    </div>
  );
};
