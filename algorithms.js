class SortingAlgorithms {
    constructor() {
        this.array = [];
        this.comparisons = 0;
        this.arrayAccesses = 0;
    }

    async quickSort(start = 0, end = this.array.length - 1) {
        if (start >= end) return;

        const pivot = await this.partition(start, end);
        await this.quickSort(start, pivot - 1);
        await this.quickSort(pivot + 1, end);
    }

    async partition(start, end) {
        const pivotValue = this.array[end];
        let pivotIndex = start;

        for (let i = start; i < end; i++) {
            this.comparisons++;
            if (this.array[i] < pivotValue) {
                await this.swap(i, pivotIndex);
                pivotIndex++;
            }
        }

        await this.swap(pivotIndex, end);
        return pivotIndex;
    }

    async mergeSort(start = 0, end = this.array.length - 1) {
        if (start >= end) return;

        const mid = Math.floor((start + end) / 2);
        await this.mergeSort(start, mid);
        await this.mergeSort(mid + 1, end);
        await this.merge(start, mid, end);
    }

    async merge(start, mid, end) {
        const leftArray = this.array.slice(start, mid + 1);
        const rightArray = this.array.slice(mid + 1, end + 1);
        
        let i = 0, j = 0, k = start;
        
        while (i < leftArray.length && j < rightArray.length) {
            this.comparisons++;
            if (leftArray[i] <= rightArray[j]) {
                this.array[k] = leftArray[i];
                i++;
            } else {
                this.array[k] = rightArray[j];
                j++;
            }
            this.arrayAccesses += 2;
            await this.visualize([k]);
            k++;
        }

        while (i < leftArray.length) {
            this.array[k] = leftArray[i];
            this.arrayAccesses++;
            await this.visualize([k]);
            i++;
            k++;
        }

        while (j < rightArray.length) {
            this.array[k] = rightArray[j];
            this.arrayAccesses++;
            await this.visualize([k]);
            j++;
            k++;
        }
    }

    async heapSort() {
        const n = this.array.length;

        // Build max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(n, i);
        }

        // Extract elements from heap one by one
        for (let i = n - 1; i > 0; i--) {
            await this.swap(0, i);
            await this.heapify(i, 0);
        }
    }

    async heapify(n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        this.comparisons += 2;
        if (left < n && this.array[left] > this.array[largest]) {
            largest = left;
        }

        if (right < n && this.array[right] > this.array[largest]) {
            largest = right;
        }

        if (largest !== i) {
            await this.swap(i, largest);
            await this.heapify(n, largest);
        }
    }

    async bubbleSort() {
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.comparisons++;
                if (this.array[j] > this.array[j + 1]) {
                    await this.swap(j, j + 1);
                }
            }
        }
    }

    async swap(i, j) {
        this.arrayAccesses += 2;
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        await this.visualize([i, j]);
    }

    // This will be implemented in script.js
    async visualize(indices) {
        // Placeholder for visualization logic
    }

    reset() {
        this.comparisons = 0;
        this.arrayAccesses = 0;
    }
} 