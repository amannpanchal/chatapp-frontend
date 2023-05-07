import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import copy from 'copy-to-clipboard'

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
        <span></span>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
         <div className="invite-message">
<p> You joined successfully</p>
          <p 
          onClick={() => {
            copy(room);
          }}
          >  Share room code  : {room}
          
          </p>
         </div>
        <div>
     {messageList.map((messageContent) => {
                return (
                  <div
                    className="message"
                    id={username === messageContent.author ? "you" : "other"}
                  >
                    <div>
                        <p id="author">{messageContent.author}</p>
                      <div className="timing">
                      <div className="message-content">
                        <p>{messageContent.message}</p>
                      </div>
                        <p id="time">{messageContent.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
     </div> 
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>
          <i class="fa-sharp fa-solid fa-paper-plane-top"></i>
          
          </button>
      </div>
    </div>
  );
}

export default Chat;
