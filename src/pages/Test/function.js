export default class Draggable {
    containerElement = null;
    drag = { element: null };
    clone = { element: null };

    constructor(options) {
        this.containerElement = options.element;

        this.init();
    }
    init() {
        this.bindEventListener();
    }
    onPointerDown(e) {
        this.drag.element = e.target;
        this.drag.element.classList.add('active');

        this.clone.element = this.drag.element.cloneNode(true);
        document.body.appendChild(this.clone.element);

        this.clone.element.className = 'clone-item';

    }
    onPointerMove(e) {
    }
    onPointerUp(e) {
    }
    bindEventListener() {
        this.containerElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.containerElement.addEventListener('pointermove', this.onPointerMove.bind(this));
        this.containerElement.addEventListener('pointerup', this.onPointerUp.bind(this));
    }
}
