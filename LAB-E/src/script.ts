const msg: string = "Hello!";
alert(msg);

const styles: string[] = ["style-1", "style-2", "style-3"];

window.onload = () => {
    const cssLink: HTMLLinkElement = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = `src/${styles[0]}.css`;
    document.head.appendChild(cssLink);

    const buttonsContainer: HTMLElement | null = document.getElementById("buttons");
    if (buttonsContainer) {
        styles.forEach((style) => {
            const button: HTMLButtonElement = document.createElement("button");
            button.textContent = `Load ${style}`;
            button.onclick = () => {
                changeStyle(cssLink, style);
            };
            buttonsContainer.appendChild(button);
        });
    }
}

function changeStyle(ref: HTMLLinkElement, style: string): void {
    ref.href = `src/${style}.css`;
}