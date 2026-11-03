import type { FAQItem } from "@/components/FAQSection";

// Complete 12 Reconstitution FAQs matching user's document
export const CALCULATOR_FAQS: FAQItem[] = [
  {
    question: "What is reconstitution?",
    answer:
      "Reconstitution is the process of dissolving a lyophilized (freeze-dried) peptide powder in a measured volume of diluent, usually bacteriostatic water, to produce a solution of a known concentration. The concentration is set entirely by two numbers: the mass of peptide in the vial and the volume of diluent added.",
  },
  {
    question: "What is the formula for peptide concentration?",
    answer:
      "Concentration in mg/mL equals the vial mass in mg divided by the diluent volume in mL. To express the same concentration in mcg/mL, multiply the mg/mL figure by 1,000. Example: 10 mg ÷ 2 mL = 5 mg/mL = 5,000 mcg/mL.",
  },
  {
    question: "How much bacteriostatic water should be added to a 5 mg vial?",
    answer:
      "There is no single correct volume. The volume is a choice, and the choice sets the concentration: 1 mL gives 5 mg/mL, 2 mL gives 2.5 mg/mL, and 3 mL gives 1.67 mg/mL. Larger volumes produce a weaker solution in physically larger, easier-to-measure portions; smaller volumes produce a stronger solution that demands finer measurement precision.",
  },
  {
    question: "How much bacteriostatic water should be added to a 10 mg vial?",
    answer:
      "As with any vial size, the volume is a choice that sets the concentration: 1 mL gives 10 mg/mL, 2 mL gives 5 mg/mL, and 3 mL gives 3.33 mg/mL. Pick the volume based on the measurement precision of the equipment in use, not on a fixed rule.",
  },
  {
    question: "Does adding more water change the concentration?",
    answer:
      "Yes. The mass of peptide in the vial is fixed, so diluent volume is the only lever over concentration. Doubling the water halves the concentration; halving the water doubles it. The total amount of peptide does not change — only how concentrated each millilitre of solution is.",
  },
  {
    question: "How long does a reconstituted peptide last in the fridge?",
    answer:
      "A commonly used working reference is around 28 days refrigerated at 2–8°C in bacteriostatic water. Treat that figure as a reference, not a guarantee: actual stability varies with the peptide sequence, the diluent, and handling. Label every vial with the concentration and the date it was mixed.",
  },
  {
    question: "Can reconstituted peptide be frozen?",
    answer:
      "Lyophilized powder stores well frozen, at −20°C or colder, for long-term storage. Once reconstituted, repeated freeze–thaw cycling damages many peptides as ice crystals form and concentrate solutes. If a solution must be frozen, divide it into single-use aliquots first so each portion is thawed only once.",
  },
  {
    question: "What is the difference between bacteriostatic water and sterile water?",
    answer:
      "Bacteriostatic water is sterile water containing 0.9% benzyl alcohol, a preservative that inhibits bacterial growth and makes it suitable for repeated entry into the same container. Plain sterile water has no preservative and is intended for single use once opened.",
  },
  {
    question: "Why should a peptide vial never be shaken?",
    answer:
      "Shaking creates foam and shear forces at the air–liquid interface, which can unfold and aggregate peptide molecules. Swirl gently or roll the vial between the palms instead, then wait for the solution to clear. A solution that stays cloudy or shows particles should be treated as compromised.",
  },
  {
    question: "What does mg/mL mean?",
    answer:
      "mg/mL is a concentration unit: the number of milligrams of peptide dissolved in each millilitre of solution. A 5 mg/mL solution contains 5 mg of peptide in every 1 mL of liquid. It describes strength, not a total amount.",
  },
  {
    question: "How do you convert micrograms (mcg) to milligrams (mg)?",
    answer:
      "Divide micrograms by 1,000. One milligram equals 1,000 micrograms, so 200 mcg = 0.2 mg and 500 mcg = 0.5 mg. Going the other way, multiply milligrams by 1,000.",
  },
  {
    question: "Does this calculator tell me how much to use?",
    answer:
      "No. This calculator performs concentration math only: vial mass divided by diluent volume. It provides no dose figures, no volumes to measure out for any purpose, and no usage or administration guidance of any kind. It is a laboratory reference tool for research use only.",
  },
];

