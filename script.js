class SortingVisualizer {
    constructor() {
        this.sorter = new SortingAlgorithms();
        this.isSorting = false;
        this.startTime = 0;
        this.setupEventListeners();
        this.generateNewArray();
    }

    setupEventListeners() {
        document.getElementById('generateArray').addEventListener('click', () => this.generateNewArray());
        document.getElementById('startSort').addEventListener('click', () => this.startSorting());
        document.getElementById('arraySize').addEventListener('input', () => this.generateNewArray());
        document.getElementById('sortingSpeed').addEventListener('input', () => {
            this.updateSpeed();
        });
    }

    generateNewArray() {
        if (this.isSorting) return;

        const size = parseInt(document.getElementById('arraySize').value);
        const array = [];
        const container = document.getElementById('arrayContainer');
        container.innerHTML = '';

        // Generate random array
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 100) + 1);
        }

        this.sorter.array = array;
        this.visualizeArray();
        this.resetStats();
    }

    visualizeArray() {
        const container = document.getElementById('arrayContainer');
        container.innerHTML = '';
        const barWidth = (container.clientWidth - (this.sorter.array.length * 2)) / this.sorter.array.length;

        this.sorter.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar';
            bar.style.height = `${value}%`;
            bar.style.width = `${barWidth}px`;
            container.appendChild(bar);
        });
    }

    async startSorting() {
        if (this.isSorting) return;

        const algorithm = document.getElementById('algorithmSelect').value;
        const startButton = document.getElementById('startSort');
        const generateButton = document.getElementById('generateArray');
        const algorithmSelect = document.getElementById('algorithmSelect');
        const arraySizeInput = document.getElementById('arraySize');

        this.isSorting = true;
        startButton.disabled = true;
        generateButton.disabled = true;
        algorithmSelect.disabled = true;
        arraySizeInput.disabled = true;

        this.resetStats();
        this.startTime = performance.now();
        this.updateStatsInterval = setInterval(() => this.updateStats(), 100);

        // Extend the SortingAlgorithms class with visualization
        this.sorter.visualize = async (indices) => {
            const bars = document.querySelectorAll('.array-bar');
            
            // Reset all bars to default state
            bars.forEach(bar => bar.style.backgroundColor = '#3498db');
            
            // Highlight bars being compared
            indices.forEach(index => {
                bars[index].style.backgroundColor = '#f1c40f';
            });

            // Update the height of the bars
            indices.forEach(index => {
                bars[index].style.height = `${this.sorter.array[index]}%`;
            });

            // Add delay based on speed slider
            const speed = document.getElementById('sortingSpeed').value;
            const delay = 101 - speed; // Inverse the speed value
            await new Promise(resolve => setTimeout(resolve, delay));
        };

        try {
            switch (algorithm) {
                case 'quickSort':
                    await this.sorter.quickSort();
                    break;
                case 'mergeSort':
                    await this.sorter.mergeSort();
                    break;
                case 'heapSort':
                    await this.sorter.heapSort();
                    break;
                case 'bubbleSort':
                    await this.sorter.bubbleSort();
                    break;
            }

            // Mark completion
            const bars = document.querySelectorAll('.array-bar');
            for (let i = 0; i < bars.length; i++) {
                bars[i].style.backgroundColor = '#2ecc71';
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        } finally {
            clearInterval(this.updateStatsInterval);
            this.updateStats();
            this.isSorting = false;
            startButton.disabled = false;
            generateButton.disabled = false;
            algorithmSelect.disabled = false;
            arraySizeInput.disabled = false;
        }
    }

    updateSpeed() {
        if (!this.isSorting) return;
        // Speed updates will take effect immediately in the visualize method
    }

    resetStats() {
        this.sorter.reset();
        document.getElementById('timeElapsed').textContent = '0.00s';
        document.getElementById('comparisons').textContent = '0';
        document.getElementById('arrayAccesses').textContent = '0';
    }

    updateStats() {
        const timeElapsed = ((performance.now() - this.startTime) / 1000).toFixed(2);
        document.getElementById('timeElapsed').textContent = `${timeElapsed}s`;
        document.getElementById('comparisons').textContent = this.sorter.comparisons;
        document.getElementById('arrayAccesses').textContent = this.sorter.arrayAccesses;
    }
}

// Initialize the visualizer when the page loads
window.addEventListener('load', () => {
    new SortingVisualizer();
}); 