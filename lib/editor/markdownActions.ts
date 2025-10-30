export type ActionResult = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export const applyMarkdownAction = (
  action: string,
  textarea: HTMLTextAreaElement
): ActionResult => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);

  const wrap = (prefix: string, suffix: string = prefix): ActionResult => {
    const next = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    // Keep selection inside wrapped text
    const newStart = start + prefix.length;
    const newEnd = newStart + selected.length;
    return { value: next, selectionStart: newStart, selectionEnd: newEnd };
  };

  const lineStart = value.lastIndexOf("\n", start - 1) + 1;

  switch (action) {
    case "bold":
      return wrap("**");
    case "italic":
      return wrap("_");
    case "strike":
      return wrap("~~");
    case "code":
      return wrap("`");
    case "h1": {
      const insert = "# ";
      const next = value.slice(0, lineStart) + insert + value.slice(lineStart);
      const delta = insert.length;
      return { value: next, selectionStart: start + delta, selectionEnd: end + delta };
    }
    case "h2": {
      const insert = "## ";
      const next = value.slice(0, lineStart) + insert + value.slice(lineStart);
      const delta = insert.length;
      return { value: next, selectionStart: start + delta, selectionEnd: end + delta };
    }
    case "h3": {
      const insert = "### ";
      const next = value.slice(0, lineStart) + insert + value.slice(lineStart);
      const delta = insert.length;
      return { value: next, selectionStart: start + delta, selectionEnd: end + delta };
    }
    case "ul": {
      const lines = selected.split("\n");
      const transformed = lines.map((l) => (l.trim() ? `- ${l}` : l)).join("\n");
      const next = value.slice(0, start) + transformed + value.slice(end);
      return {
        value: next,
        selectionStart: start,
        selectionEnd: start + transformed.length,
      };
    }
    case "ol": {
      const lines = selected.split("\n");
      const transformed = lines
        .map((l, i) => (l.trim() ? `${i + 1}. ${l}` : l))
        .join("\n");
      const next = value.slice(0, start) + transformed + value.slice(end);
      return {
        value: next,
        selectionStart: start,
        selectionEnd: start + transformed.length,
      };
    }
    case "quote": {
      const lines = selected.split("\n");
      const transformed = lines.map((l) => (l ? `> ${l}` : l)).join("\n");
      const next = value.slice(0, start) + transformed + value.slice(end);
      return {
        value: next,
        selectionStart: start,
        selectionEnd: start + transformed.length,
      };
    }
    case "hr": {
      const insert = "\n\n---\n\n";
      const next = value.slice(0, end) + insert + value.slice(end);
      const pos = end + insert.length;
      return { value: next, selectionStart: pos, selectionEnd: pos };
    }
    case "link": {
      const template = `[${selected || "link text"}](https://)`;
      const next = value.slice(0, start) + template + value.slice(end);
      const newStart = start + 1; // inside brackets
      const newEnd = start + 1 + (selected || "link text").length;
      return { value: next, selectionStart: newStart, selectionEnd: newEnd };
    }
    case "image": {
      const template = `![alt text](https://via.placeholder.com/800x400)`;
      const next = value.slice(0, start) + template + value.slice(end);
      const altStart = start + 2; // after ![
      const altEnd = altStart + "alt text".length;
      return { value: next, selectionStart: altStart, selectionEnd: altEnd };
    }
    default:
      return { value, selectionStart: start, selectionEnd: end };
  }
};
