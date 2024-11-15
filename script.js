// script.js

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false; // Process only finalized results
  recognition.continuous = true; // Keep listening for speech

  const startButton = document.getElementById("start-button");
  const stopButton = document.getElementById("stop-button");
  const downloadButton = document.getElementById("download-button");
  const output = document.getElementById("output");
  const timer = document.getElementById("timer");

  let transcript = ""; // Stores the complete transcript
  let lastTranscript = ""; // Tracks the last processed sentence
  let timerInterval;
  let seconds = 0;

  // Format the timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start the timer
  const startTimer = () => {
    console.log("Timer started");
    timerInterval = setInterval(() => {
      seconds++;
      timer.textContent = formatTime(seconds);
    }, 1000);
  };

  // Stop the timer
  const stopTimer = () => {
    console.log("Timer stopped");
    clearInterval(timerInterval);
    seconds = 0;
    timer.textContent = "00:00";
  };

  // Start recognition
  startButton.addEventListener("click", () => {
    console.log("Start button clicked");
    recognition.start();
    transcript = ""; // Reset the transcript
    lastTranscript = ""; // Reset the last processed result
    startButton.disabled = true;
    stopButton.disabled = false;
    downloadButton.disabled = true;
    output.value = ""; // Clear the textarea
    startTimer();
  });

  // Stop recognition
  stopButton.addEventListener("click", () => {
    console.log("Stop button clicked");
    recognition.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
    downloadButton.disabled = false;
    stopTimer();
  });

  // Handle recognition results
  recognition.addEventListener("result", (event) => {
    const newResult = event.results[event.results.length - 1][0].transcript.trim(); // Get the latest result

    // Add only if it's different from the last processed transcript
    if (newResult !== lastTranscript) {
      transcript += newResult + ".\n"; // Append with paragraph spacing
      lastTranscript = newResult; // Update the last processed sentence
      output.value = transcript; // Update the textarea
    }
  });

  // Handle recognition end
  recognition.addEventListener("end", () => {
    console.log("Recognition ended");

    // Check if stop button is still enabled, which means the user hasn't stopped it manually
    if (!stopButton.disabled) {
      console.log("Restarting recognition");
      recognition.start(); // Restart recognition
    }
  });

  // Handle download
  downloadButton.addEventListener("click", () => {
    console.log("Download button clicked");
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url); // Clean up the URL
  });

  // Handle errors
  recognition.addEventListener("error", (event) => {
    console.error("Error occurred: " + event.error);
    startButton.disabled = false;
    stopButton.disabled = true;
    stopTimer();
  });
      }
