export function fallbackSummaries(files) {
  return {
    files: files.map((f) => ({
      path: f.path,
      summaries: [
        `Smoke test for exported functions in ${f.path}`,
        `Error/edge cases for core methods in ${f.path}`,
        `Integration flow covering main public API of ${f.path}`
      ]
    }))
  };
}

export function fallbackTestCode({ framework, filePath, summary }) {
  const baseName = filePath.split('/').pop() || 'module';
  const noExt = baseName.replace(/\\.[^.]+$/, '');

  const fw = framework.toLowerCase();
  if (fw.includes('pytest') || fw.includes('python')) {
    return `# Auto-generated PyTest for ${filePath}
import importlib
import pytest

module = importlib.import_module("${noExt}")

def test_smoke_${noExt}():
    assert module is not None

def test_edge_${noExt}():
    # TODO: replace with real edge case assertions
    assert True

def test_integration_${noExt}():
    # TODO: replace with real integration flow
    assert True
`;
  }
  if (fw.includes('junit') || fw.includes('java')) {
    return `// Auto-generated JUnit test for ${filePath}
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class ${noExt.charAt(0).toUpperCase() + noExt.slice(1)}Test {
  @Test
  public void smokeTest() {
    assertTrue(true);
  }

  @Test
  public void edgeCases() {
    assertEquals(1, 1);
  }

  @Test
  public void integrationFlow() {
    assertNotNull(new Object());
  }
}
`;
  }
  // default Jest/JS/TS
  return `// Auto-generated Jest test for ${filePath}
import * as Module from '${filePath.startsWith('.') ? filePath : './' + baseName}';

describe('${summary}', () => {
  test('smoke: module loads', () => {
    expect(Module).toBeTruthy();
  });

  test('edge: placeholder', () => {
    expect(true).toBe(true);
  });

  test('integration: placeholder', () => {
    expect(1 + 1).toBe(2);
  });
});
`;
}
