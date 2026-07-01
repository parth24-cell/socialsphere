"use client";

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Mic, Paperclip, Send } from "lucide-react";

const MESSAGES = [
  { id: 1, text: "Hey! Did you check out the new design system?", sender: "other", time: "10:24 AM" },
  { id: 2, text: "Yes! The contrast ratios are looking incredible. ✨", sender: "me", time: "10:25 AM" },
  { id: 3, text: "Wait until you see the new dark mode.", sender: "other", time: "10:26 AM" },
  { id: 4, text: "Can't wait. Ready for the review?", sender: "me", time: "10:27 AM" }
];

export function MessagingShowcase() {
  const [messages, setMessages] = useState<typeof MESSAGES>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);

  // Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-500, 500], [5, -5]);
  const rotateY = useTransform(mouseX, [-500, 500], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Choreographed Message Loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runSequence = () => {
      setMessages([]);
      setStep(0);

      // Add msg 1
      timeout = setTimeout(() => {
        setMessages([MESSAGES[0]]);
        
        // Me typing
        timeout = setTimeout(() => {
           setIsTyping(true);
           
           // Me sends msg 2
           timeout = setTimeout(() => {
              setIsTyping(false);
              setMessages([MESSAGES[0], MESSAGES[1]]);
              
              // Other typing
              timeout = setTimeout(() => {
                 setIsTyping(true);
                 
                 // Other sends msg 3
                 timeout = setTimeout(() => {
                    setIsTyping(false);
                    setMessages([MESSAGES[0], MESSAGES[1], MESSAGES[2]]);
                    
                    // Me typing
                    timeout = setTimeout(() => {
                       setIsTyping(true);

                       // Me sends msg 4
                       timeout = setTimeout(() => {
                          setIsTyping(false);
                          setMessages([...MESSAGES]);
                          
                          // Restart
                          timeout = setTimeout(runSequence, 4000);
                       }, 1500);
                    }, 1000);
                 }, 2000);
              }, 1000);
           }, 2000);
        }, 1500);
      }, 1000);
    };

    runSequence();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div 
      className="relative w-full max-w-sm aspect-[9/16] flex items-center justify-center [perspective:1000px] mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient Glow */}
      <motion.div 
         className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full"
         animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass Container */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="w-full h-full bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden relative z-10 flex flex-col"
      >
         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

         {/* Header */}
         <div className="flex items-center gap-3 pb-4 border-b border-white/5 relative z-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
               <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
                  <div className="w-full h-full bg-purple-500/20" />
               </div>
            </div>
            <div className="flex flex-col">
               <span className="text-white font-medium text-sm leading-tight">Sarah Jenkins</span>
               <span className="text-emerald-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
               </span>
            </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 py-4 flex flex-col gap-4 relative z-10 overflow-hidden justify-end">
            <AnimatePresence initial={false}>
               {messages.map((msg, i) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95, originX: msg.sender === 'me' ? 1 : 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                     <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-purple-600 text-white rounded-br-sm' : 'bg-white/10 text-white rounded-bl-sm'}`}>
                        {msg.text}
                     </div>
                     <span className="text-white/40 text-[10px] mt-1 flex items-center gap-1">
                        {msg.time}
                        {msg.sender === 'me' && i < messages.length - 1 && (
                           <motion.span 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }} 
                              className="text-purple-400 font-medium"
                           >
                              Read
                           </motion.span>
                        )}
                     </span>
                  </motion.div>
               ))}
               
               {/* Typing Indicator */}
               {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="self-start bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center"
                  >
                     <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                     <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                     <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Input */}
         <div className="pt-3 flex gap-2 relative z-10">
            <div className="flex-1 bg-white/5 rounded-full px-4 py-2.5 border border-white/10 flex items-center justify-between">
               <span className="text-white/40 text-sm">Message...</span>
               <Paperclip className="w-4 h-4 text-white/40" />
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
               {isTyping && messages.length % 2 !== 0 ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                     <Send className="w-4 h-4 text-white ml-0.5" />
                  </motion.div>
               ) : (
                  <Mic className="w-4 h-4 text-white" />
               )}
            </div>
         </div>
      </motion.div>
    </div>
  );
}
