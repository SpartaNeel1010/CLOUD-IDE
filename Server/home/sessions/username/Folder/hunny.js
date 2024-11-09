function printTree(height) {
    for (let i = 0; i < height; i++) {
        let spaces = " ".repeat(height - i - 1);
        let stars = "*".repeat(2 * i + 1);
        console.log(spaces + stars);
    }
}

printTree(5);