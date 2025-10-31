import DOMPurify from "dompurify";
import parse, { domToReact, Element } from "html-react-parser";

type RenderHtmlProps = {
  content: string;
};

export function HTMLText({ content }: RenderHtmlProps) {
  if (!content) return null;

  const decodeHtmlEntities = (str: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const decoded = /&lt;|&gt;|&amp;/.test(content) ? decodeHtmlEntities(content) : content;

  const safeHtml = DOMPurify.sanitize(decoded, {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "br", "p", "ul", "ol", "li", "a", "u"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  const reactNodes = parse(safeHtml, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "a") {
        const props = domNode.attribs || {};
        return (
          <a
            href={props.href}
            target={props.target || "_blank"}
            rel={props.rel || "noopener noreferrer"}
            className="underline text-secondary font-semibold"
          >
            {domToReact(domNode.children as import("html-react-parser").DOMNode[])}
          </a>
        );
      }
      return undefined;
    },
  });

  return <>{reactNodes}</>;
}