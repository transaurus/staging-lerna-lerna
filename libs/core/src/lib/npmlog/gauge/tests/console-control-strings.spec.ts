import * as consoleControl from "../console-control-strings";

describe("console-control-strings", () => {
  describe("cursor movement with optional count", () => {
    const movements: Record<string, string> = {
      up: "A",
      down: "B",
      forward: "C",
      back: "D",
      nextLine: "E",
      previousLine: "F",
    };

    for (const [name, code] of Object.entries(movements)) {
      it(`${name}() without argument`, () => {
        expect((consoleControl as any)[name]()).toBe(`\x1b[${code}`);
      });
      it(`${name}(10) with count`, () => {
        expect((consoleControl as any)[name](10)).toBe(`\x1b[10${code}`);
      });
    }
  });

  describe("no-argument commands", () => {
    const commands: Record<string, string> = {
      eraseData: "J",
      eraseLine: "K",
      hideCursor: "?25l",
      showCursor: "?25h",
    };

    for (const [name, code] of Object.entries(commands)) {
      it(`${name}()`, () => {
        expect((consoleControl as any)[name]()).toBe(`\x1b[${code}`);
      });
    }
  });

  describe("horizontalAbsolute", () => {
    it("positions to column 10", () => {
      expect(consoleControl.horizontalAbsolute(10)).toBe("\x1b[10G");
    });

    it("positions to column 0", () => {
      expect(consoleControl.horizontalAbsolute(0)).toBe("\x1b[0G");
    });

    it("throws when called without argument", () => {
      expect(() => (consoleControl as any).horizontalAbsolute()).toThrow();
    });
  });

  describe("color", () => {
    it("sets multiple styles", () => {
      expect(consoleControl.color("bold", "white", "bgBlue")).toBe("\x1b[1;37;44m");
    });

    it("throws on invalid color name", () => {
      expect(() => consoleControl.color("bold", "invalid", "blue")).toThrow(
        "Unknown color or style name: invalid"
      );
    });

    it("resets color", () => {
      expect(consoleControl.color("reset")).toBe("\x1b[0m");
    });
  });

  describe("goto", () => {
    it("positions cursor absolutely", () => {
      expect(consoleControl.goto(10, 3)).toBe("\x1b[3;10H");
    });
  });

  describe("gotoSOL", () => {
    it("returns carriage return", () => {
      expect(consoleControl.gotoSOL()).toBe("\r");
    });
  });

  describe("beep", () => {
    it("returns BEL character", () => {
      expect(consoleControl.beep()).toBe("\x07");
    });
  });
});
