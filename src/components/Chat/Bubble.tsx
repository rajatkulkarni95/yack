import { TConversation } from "../../pages/chat/[id]";
import showdown from "showdown";
// import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

type TChatBubble = {
  message: TConversation;
  loading?: boolean;
};

const ChatBubble = ({ message, loading }: TChatBubble) => {
  const converter = new showdown.Converter();
  const html = converter.makeHtml(message.conversation.content);

  return (
    <div
      className={`py-2 px-3 text-bubble break-words w-fit !max-w-[70%] whitespace-pre-wrap rounded-lg mb-3 ${
        message.conversation.role === "user"
          ? "bg-action ml-auto"
          : "bg-secondary mr-auto"
      }`}
      dangerouslySetInnerHTML={{ __html: html }}
    >
      {/* {loading && <EllipsisHorizontalIcon className="h-5 w-5 animate-spin" />} */}
    </div>
  );
};

export default ChatBubble;

// 49dbfc2e-0656-46be-ad31-f6b2600d624f	{"created":"2023-04-16T16:09:30.943Z","messages":[{"created":"2023-04-16T16:13:44.034Z","conversation":{"role":"user","content":"how to handle Enter keypress for a button in react?"}},{"created":"2023-04-16T16:13:54.180Z","conversation":{"role":"assistant","content":"You can handle the Enter keypress for a button in React by adding a keydown event listener to the button and checking if the event key is \"Enter\". Here's an example:\n\n```\nfunction MyButton() {\n  const handleClick = () => {\n    // handle button click\n  };\n\n  const handleKeyPress = (event) => {\n    if (event.key === 'Enter') {\n      handleClick();\n    }\n  };\n\n  return (\n    <button onClick={handleClick} onKeyPress={handleKeyPress}>My button</button>\n  );\n}\n```\n\nIn this example, we define two functions: `handleClick` to handle the button click event, and `handleKeyPress` to handle the Enter keypress event. We add both functions as event listeners to the button using the `onClick` and `onKeyPress` props. When the button is clicked or the Enter key is pressed while the button is focused, `handleClick` will be called."}},{"created":"2023-04-16T16:14:13.665Z","conversation":{"role":"user","content":"keypress is deprecated it seems"}},{"created":"2023-04-16T16:14:21.725Z","conversation":{"role":"assistant","content":"You're correct, `onKeyPress` is deprecated in React. The new recommended way to handle key events is to use `onKeyDown` and check for the key code. Here's an updated example:\n\n```\nfunction MyButton() {\n  const handleClick = () => {\n    // handle button click\n  };\n\n  const handleKeyDown = (event) => {\n    if (event.keyCode === 13) { // Enter key code\n      handleClick();\n    }\n  };\n\n  return (\n    <button onClick={handleClick} onKeyDown={handleKeyDown}>My button</button>\n  );\n}\n```\n\nIn this example, we use the `onKeyDown` prop instead of `onKeyPress`, and check for the Enter key code (`13`) instead of the event key. This will handle the Enter keypress event for the button."}}]}
