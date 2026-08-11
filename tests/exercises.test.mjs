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

async function importTypeScriptModule(relativePath) {
  const file = new URL(relativePath, import.meta.url);
  const source = await readFile(file, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
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

test("practical inputs convert to hiragana as typing progresses", async () => {
  const { romanToHiragana } = await importTypeScriptModule("../app/lib/roman-to-hiragana.ts");
  assert.equal(romanToHiragana("osew"), "おせ");
  assert.equal(romanToHiragana("osewa"), "おせわ");
  assert.equal(romanToHiragana("osewaninatteorimasu.", true), "おせわになっております。");
  assert.equal(
    romanToHiragana("nennotame,mitsumorishowosaisouitashimasu.", true),
    "ねんのため、みつもりしょをさいそういたします。",
  );
  assert.equal(
    romanToHiragana("kaigiganagabiiteirutame,juppunhodookuremasu.", true),
    "かいぎがながびいているため、じゅっぷんほどおくれます。",
  );

  for (const category of ["mail", "meeting", "chat", "document"]) {
    const exercises = await readStringProperties(category);
    for (const exercise of exercises) {
      const converted = romanToHiragana(exercise.input, true);
      assert.match(converted, /^[\u3040-\u309f、。！？ー　\n]+$/, `${exercise.id} hiragana output`);
    }
  }
});
