export const SUMMARY_PROMPT = (files) => `
You are a senior test engineer. For each file below, propose focused test case summaries.
Respond ONLY in JSON:
{
  "files": [
    { "path": "string", "summaries": ["string", "string", "..."] }
  ]
}
` + files.map((f, i) => `
FILE ${i + 1}: ${f.path}
---
${f.content.slice(0, 4000)}
`).join('\\n');

export const CODE_PROMPT = ({ framework, filePath, summary, fileContent }) => `
Write runnable test code using ${framework}.
Target File: ${filePath}
Test summary: ${summary}
Source (truncated):
${fileContent.slice(0, 4000)}

Return ONLY the test code.
`;
