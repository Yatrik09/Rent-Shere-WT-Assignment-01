import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Message = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);

  const incomingOwnerId = location.state?.ownerId;
  const incomingItemId = location.state?.itemId;
  const incomingOwnerName = location.state?.ownerName;
  const incomingItemTitle = location.state?.itemTitle;

  const currentUserId = user?._id || user?.id;

  const getOtherPersonName = (conversation) => {
    if (!conversation) return "User";

    if (conversation.ownerId?._id === currentUserId) {
      return conversation.renterId?.name || "User";
    }

    return conversation.ownerId?.name || "User";
  };

  const getConversationSubtitle = (conversation) => {
    return conversation?.itemId?.title || "Item chat";
  };

  const fetchConversations = async () => {
    try {
      setLoadingChats(true);

      const res = await fetch("http://localhost:5000/api/chat/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load conversations");
      }

      const uniqueConversations = [];
      const seen = new Set();

      (Array.isArray(data) ? data : []).forEach((conv) => {
        const key = `${conv.itemId?._id}-${conv.ownerId?._id}-${conv.renterId?._id}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueConversations.push(conv);
        }
      });

      setConversations(uniqueConversations);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);

      const res = await fetch(
        `http://localhost:5000/api/chat/messages/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load messages");
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const createOrOpenConversation = async () => {
    if (!incomingOwnerId || !incomingItemId) return;

    try {
      const res = await fetch("http://localhost:5000/api/chat/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ownerId: incomingOwnerId,
          itemId: incomingItemId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to open conversation");
      }

      setSelectedConversation(data);
      await fetchConversations();
      await fetchMessages(data._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (incomingOwnerId && incomingItemId) {
      createOrOpenConversation();
    }
  }, [incomingOwnerId, incomingItemId]);

  useEffect(() => {
    if (selectedConversation?._id) {
      socket.emit("joinConversation", selectedConversation._id);
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !selectedConversation?._id) return;

    try {
      const res = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: selectedConversation._id,
          text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      socket.emit("sendMessage", data);
      setText("");
      fetchConversations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/conversation/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete conversation");
      }

      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }

      fetchConversations();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete conversation");
    }
  };

  const selectedHeaderName = useMemo(() => {
    if (!selectedConversation) return "Select a chat";
    return getOtherPersonName(selectedConversation);
  }, [selectedConversation, currentUserId]);

  const selectedHeaderItem = useMemo(() => {
    if (!selectedConversation) return "";
    return getConversationSubtitle(selectedConversation);
  }, [selectedConversation]);

  return (
    <div style={pageStyle}>
      <div style={chatLayoutStyle}>
        <div style={sidebarStyle}>
          <div style={sidebarHeaderStyle}>Messages</div>

          {loadingChats ? (
            <p style={{ padding: "16px" }}>Loading chats...</p>
          ) : conversations.length === 0 ? (
            <p style={{ padding: "16px" }}>No conversations yet.</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                style={{
                  ...chatUserItemStyle,
                  background:
                    selectedConversation?._id === conversation._id
                      ? "#eef5ff"
                      : "#fff",
                }}
              >
                <div
                  onClick={() => setSelectedConversation(conversation)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flex: 1,
                    cursor: "pointer",
                  }}
                >
                  <div style={avatarStyle}>
                    {getOtherPersonName(conversation).charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={chatNameStyle}>
                      {getOtherPersonName(conversation)}
                    </div>
                    <div style={chatSubtitleStyle}>
                      {getConversationSubtitle(conversation)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteConversation(conversation._id)}
                  style={deleteButtonStyle}
                  title="Delete chat"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        <div style={chatWindowStyle}>
          {selectedConversation ? (
            <>
              <div style={chatHeaderStyle}>
                <div style={avatarStyle}>
                  {selectedHeaderName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={chatHeaderNameStyle}>{selectedHeaderName}</div>
                  <div style={chatHeaderItemStyle}>{selectedHeaderItem}</div>
                </div>
              </div>

              <div style={messagesAreaStyle}>
                {loadingMessages ? (
                  <p>Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p>No messages yet. Start the conversation.</p>
                ) : (
                  messages.map((msg) => {
                    const isMine =
                      msg.senderId === currentUserId ||
                      msg.senderId?._id === currentUserId;

                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: "flex",
                          justifyContent: isMine ? "flex-end" : "flex-start",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            ...messageBubbleStyle,
                            background: isMine ? "#0066cc" : "#f1f1f1",
                            color: isMine ? "#fff" : "#333",
                          }}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef}></div>
              </div>

              <div style={messageInputWrapperStyle}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  style={messageInputStyle}
                />

                <button onClick={sendMessage} style={sendButtonStyle}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={emptyChatStyle}>
              <h3>Select a conversation</h3>
              {incomingOwnerName && incomingItemTitle && (
                <p>
                  Opening chat with {incomingOwnerName} for {incomingItemTitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  maxWidth: "1300px",
  margin: "20px auto",
  padding: "10px 20px",
};

const chatLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "350px 1fr",
  gap: "0",
  background: "#fff",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  minHeight: "75vh",
};

const sidebarStyle = {
  borderRight: "1px solid #eee",
  background: "#fff",
};

const sidebarHeaderStyle = {
  padding: "18px",
  fontSize: "22px",
  fontWeight: "700",
  borderBottom: "1px solid #eee",
};

const chatUserItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "14px 16px",
  borderBottom: "1px solid #f5f5f5",
};

const avatarStyle = {
  width: "46px",
  height: "46px",
  borderRadius: "50%",
  background: "#0066cc",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
};

const chatNameStyle = {
  fontWeight: "600",
  color: "#1a1a2e",
};

const chatSubtitleStyle = {
  fontSize: "13px",
  color: "#666",
  marginTop: "4px",
};

const deleteButtonStyle = {
  background: "transparent",
  border: "none",
  color: "#cc0000",
  fontSize: "18px",
  cursor: "pointer",
  marginLeft: "10px",
};

const chatWindowStyle = {
  display: "flex",
  flexDirection: "column",
  background: "#f8f9fa",
};

const chatHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "16px 18px",
  background: "#fff",
  borderBottom: "1px solid #eee",
};

const chatHeaderNameStyle = {
  fontWeight: "700",
  color: "#1a1a2e",
};

const chatHeaderItemStyle = {
  fontSize: "13px",
  color: "#666",
  marginTop: "2px",
};

const messagesAreaStyle = {
  flex: 1,
  padding: "20px",
  overflowY: "auto",
};

const messageBubbleStyle = {
  maxWidth: "65%",
  padding: "10px 14px",
  borderRadius: "14px",
  fontSize: "14px",
  lineHeight: "1.5",
};

const messageInputWrapperStyle = {
  display: "flex",
  gap: "10px",
  padding: "16px",
  background: "#fff",
  borderTop: "1px solid #eee",
};

const messageInputStyle = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  outline: "none",
};

const sendButtonStyle = {
  background: "linear-gradient(135deg,#0066cc,#0099ff)",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const emptyChatStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  color: "#666",
};

export default Message;