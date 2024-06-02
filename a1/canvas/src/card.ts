import { Pattern } from "./pattern";

export class Card {
    public rotation: number = 0;
    constructor(
        public x: number,
        public y: number,
        public pattern: Pattern,
        public hoveredOn = false,
        public faceUp = true,
        public matched = false,
    ) {}

    flip() {
        this.faceUp = !this.faceUp;
    }

    draw(gc: CanvasRenderingContext2D) {
        // Save the current state of the canvas
        gc.save();
    
        // Translate to the center of the card
        gc.translate(this.x, this.y);
    
        // Rotate the card by this.ratation degrees
        gc.rotate((this.rotation / 180) * Math.PI);
    
        // Draw the card as before, but with the coordinates translated back
        // Draw highlight background if the cursor is hovering on it
        if (!this.matched && this.hoveredOn) {
            gc.beginPath();
            gc.fillStyle = "yellow";
            gc.rect(-44, -44, 88, 88);
            gc.fill();
        }
        
        // Draw card background
        gc.beginPath();
        gc.fillStyle = "white";
        gc.strokeStyle = "black";
        gc.lineWidth = 2;
        gc.rect(-40, -40, 80, 80);
        gc.fill();
        gc.stroke();
    
        if (this.faceUp) {
            // Draw pattern
            this.pattern.draw(gc);
    
        } else {
            gc.beginPath();
            gc.fillStyle = "lightblue";
            gc.strokeStyle = "white";
            gc.rect(-35, -35, 70, 70);
            gc.fill();
            gc.stroke();
        }
    
        if (this.matched) {
            gc.fillStyle = 'rgba(255, 255, 255, 0.5)'; // semi-transparent white
            gc.fillRect(-40, -40, 80, 80);
        }
    
        // Restore the canvas to its original state
        gc.restore();
    }
}
