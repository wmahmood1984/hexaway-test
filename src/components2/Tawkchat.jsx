import { useEffect, useState } from "react";

const TawkChat = () => {
  const [tawkReady, setTawkReady] = useState(false);

  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6938372f6127cb198377b4b6/1jc1pf52e";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    // Poll every 500ms until Tawk_API.toggle exists
    const interval = setInterval(() => {
      if (window.Tawk_API?.toggle) {
        setTawkReady(true);
        clearInterval(interval);
        console.log("Tawk is now ready!");
      }
    }, 500);

    return () => {
      clearInterval(interval);
      // Optional cleanup: remove iframe & container if desired
      // const tawkDiv = document.querySelector("[id^='tawk_']");
      // if (tawkDiv) tawkDiv.remove();
      // const iframe = document.querySelector("iframe[src*='tawk.to']");
      // if (iframe) iframe.remove();
    };
  }, []);

  const toggleChat = () => {
    if (tawkReady) {
      window.Tawk_API.toggle();
    } else {
      console.log("Tawk still not ready, please wait...");
    }
  };

  return (
    <button
      onClick={toggleChat}
      style={{ background: "transparent", border: "none", cursor: "pointer" }}
    >
      {/* <img width="100px" src="29.png" alt="Chat with us" /> */}
    </button>
  );
};

export default TawkChat;
