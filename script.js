// Linking succes
console.log("script linked");

document.addEventListener('DOMContentLoaded', () => {
    // Generate color scheme
    mdui.setColorScheme('#556b2f');

    const startButton = document.querySelector('mdui-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = 'quiz/quiz1.html';
        });
    }
});

// Log colours for testing purposes
const rootStyles = getComputedStyle(document.documentElement);
console.log("surface", rootStyles.getPropertyValue('--mdui-color-surface'));
console.log("background", rootStyles.getPropertyValue('--mdui-color-background'));
console.log("primary", rootStyles.getPropertyValue('--mdui-color-primary'));
console.log("secondary", rootStyles.getPropertyValue('--mdui-color-secondary'));
console.log("error", rootStyles.getPropertyValue('--mdui-color-error'));
console.log("on-surface", rootStyles.getPropertyValue('--mdui-color-on-surface'));
console.log("on-background", rootStyles.getPropertyValue('--mdui-color-on-background'));
console.log("on-primary", rootStyles.getPropertyValue('--mdui-color-on-primary'));
console.log("on-secondary", rootStyles.getPropertyValue('--mdui-color-on-secondary'));
console.log("on-error", rootStyles.getPropertyValue('--mdui-color-on-error'));
console.log("surface-variant", rootStyles.getPropertyValue('--mdui-color-surface-variant'));
console.log("outline", rootStyles.getPropertyValue('--mdui-color-outline'));

