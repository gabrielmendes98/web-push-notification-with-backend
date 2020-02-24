const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!');
  }
  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!');
  }
  return true;
};

// Function to register a service worker.
const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker
    .register('service.js', {
      scope: '/'
    })
    .then(function(reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })
    .catch(function(error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
  return swRegistration;
};

// get permission from the user
const requestNotificationPermission = async () => {
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  const permission = await window.Notification.requestPermission();
  if (permission == 'granted') {
    const swRegistration = await registerServiceWorker();
  } else if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification');
  }
};

const main = async () => {
  //notice I changed main to async function so that I can use await for registerServiceWorker
  if (check()) {
    await requestNotificationPermission();
  }
};

// main();
