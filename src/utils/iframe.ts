import { debounce } from './debounce';

export function setupIframeResizer() {
  // Function to send height to parent
  function sendHeight() {
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: 'resize', height }, '*');
  }

  // Debounced version of sendHeight to avoid too many messages
  const debouncedSendHeight = debounce(sendHeight, 100);

  // Initial height
  sendHeight();

  // Listen for DOM changes
  const observer = new MutationObserver(debouncedSendHeight);
  
  // Observe the entire document for changes
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  });

  // Listen for window resize
  window.addEventListener('resize', debouncedSendHeight);

  // Listen for dynamic content loading
  window.addEventListener('load', sendHeight);

  // Cleanup function
  return () => {
    observer.disconnect();
    window.removeEventListener('resize', debouncedSendHeight);
    window.removeEventListener('load', sendHeight);
  };
}