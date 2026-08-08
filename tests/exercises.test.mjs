import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const categories = {
  mail: 16,
  meeting: 16,
  chat: 16,
  document: 16,
  hello: 12,
  variables: 12,
  condition: 12,
  loop: 12,
  method: 12,
};

const supportedInput = /^[a-zA-Z0-9 \n,.;:\/\[\]\-!"#$%&'()*+=<>?{}]+$/;

async function readStringProperties(category) {
  const file = new URL(`../app/data/exercises/${category}.ts`, import.meta.url);
  const source = ts.createSourceFile(
    file.pathname,
    await readFile(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const entries = [];
  let current = {};

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      current = {};
      for (const property of node.properties) {
        if (
          ts.isPropertyAssignment(property) &&
          ts.isIdentifier(property.name) &&
          ts.isStringLiteralLike(property.initializer)
        ) {
          current[property.name.text] = property.initializer.text;
        }
      }
      if (current.id && current.input) entries.push(current);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return entries;
}

test("category exercise files have unique IDs and supported input", async () => {
  const allIds = [];

  for (const [category, expectedCount] of Object.entries(categories)) {
    const exercises = await readStringProperties(category);
    assert.equal(exercises.length, expectedCount, `${category} exercise count`);
    for (const exercise of exercises) {
      assert.match(exercise.id, new RegExp(`^${category}-\\d+$`));
      assert.match(exercise.input, supportedInput, `${exercise.id} input mapping`);
      allIds.push(exercise.id);
    }
  }

  assert.equal(new Set(allIds).size, allIds.length, "exercise IDs must be unique");
});
