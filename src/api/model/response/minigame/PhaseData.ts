export class PhaseData {
  READY: number;
  SETUP: number;
  PRESENT: number;
  INPUT: number;
  WAIT: number;
  EXECUTE: number;
  REVEAL: number;
  CLEANUP: number;

  private constructor(
    ready: number,
    setup: number,
    present: number,
    input: number,
    wait: number,
    execute: number,
    reveal: number,
    cleanup: number
  ) {
    this.READY = ready;
    this.SETUP = setup;
    this.PRESENT = present;
    this.INPUT = input;
    this.WAIT = wait;
    this.EXECUTE = execute;
    this.REVEAL = reveal;
    this.CLEANUP = cleanup;
  }

  static fromJSON(j: any): PhaseData {
    return new PhaseData(
      Number(j?.READY ?? 0),
      Number(j?.SETUP ?? 0),
      Number(j?.PRESENT ?? 0),
      Number(j?.INPUT ?? 0),
      Number(j?.WAIT ?? 0),
      Number(j?.EXECUTE ?? 0),
      Number(j?.REVEAL ?? 0),
      Number(j?.CLEANUP ?? 0)
    );
  }
}
