import assert from "assert";
import { cards } from "../data/cards";
import { PhoneticsPreference } from "../state/reducers/phoneticsPreference";
import {
  getPhonetics,
  mcoToWebsterTones,
  normalizeAndRemovePunctuation,
  simplifyMCO,
} from "./phonetics";

describe("MCO", () => {
  it.each([
    ["sǔ:dáli", "sǔ:dáli".normalize("NFD"), "sudali"],
    ["Sa:sa aná:ɂi", "sa:sa aná:ɂi".normalize("NFD"), "sasa anaɂi"],
    [
      "U:ni:ji:ya dù:hyoha na asgaya",
      "u:ni:tsi:ya dù:hyoha na asgaya".normalize("NFD"),
      "unitsiya duhyoha na asgaya",
    ],
    [
      "na yǒ:na achű:ja já:ni dù:dó:ʔa",
      "na yǒ:na achű:tsa tsá:ni dù:dó:ɂa".normalize("NFD"),
      "na yona achutsa tsani dudoɂa",
    ],
  ])(
    "works for a bunch of examples",
    (richPhonetics, expectedNormalized, expectedSimplified) => {
      const actualNormalized = normalizeAndRemovePunctuation(richPhonetics);
      assert.deepStrictEqual(
        actualNormalized,
        expectedNormalized,
        "Should produce expected normalized output"
      );

      const actualSimplified = simplifyMCO(actualNormalized);
      assert.deepStrictEqual(
        actualSimplified,
        expectedSimplified,
        "Should produce expected simplified output"
      );
    }
  );
});

describe("mcoToWebsterTones", () => {
  it.each([
    ["sǔ:dáli", "su²³da³li"],
    ["sadv́:di à:gowhtíha", "sa²dv³³di a¹¹go²whti³ha"],
    [
      "na yǒ:na achű:ja já:ni dù:dó:ʔa",
      "na yo²³na a²chu⁴⁴tsa tsa³³ni du¹¹do³³ɂa",
    ],
    ["Ahyv:dagwalò:sgi", "a²hyv²²da²gwa²lo¹¹sgi"],
    ["Ayv:wi:ya̋", "a²yv²²wi²²ya⁴"],
  ])(
    "converts from diacritic- to superscript-based orthographies",
    (mco, expected) => {
      const normalized = normalizeAndRemovePunctuation(mco);
      const actual = mcoToWebsterTones(normalized);
      assert.deepStrictEqual(
        actual,
        expected,
        "Should produce expected output"
      );
    }
  );
});

describe("getPhonetics", () => {
  it("(simple) removes all diacritics and superscripts from all terms", () => {
    const termsWithDiacriticsLeft = cards.reduce<string[]>((arr, card) => {
      const websterTones = getPhonetics(card, PhoneticsPreference.Simple);
      return websterTones.normalize("NFD").match(/[:\u0300-\u036f¹²³⁴]/g) ===
        null
        ? arr
        : [...arr, `original: ${card.cherokee} -- actual: ${websterTones}`];
    }, []);
    assert.deepStrictEqual(
      termsWithDiacriticsLeft,
      [],
      "there should be no terms with diacritics or superscripts left"
    );
  });

  it("(detailed) removes all diacritics from all terms", () => {
    const termsWithDiacriticsLeft = cards.reduce<string[]>((arr, card) => {
      const websterTones = getPhonetics(card, PhoneticsPreference.Detailed);
      return websterTones.normalize("NFD").match(/[:\u0300-\u036f]/g) === null
        ? arr
        : [...arr, `original: ${card.cherokee} -- actual: ${websterTones}`];
    }, []);
    assert.deepStrictEqual(
      termsWithDiacriticsLeft,
      [],
      "there should be no terms with diacritics left"
    );
  });
});
