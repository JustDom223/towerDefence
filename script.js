window.addEventListener('load'),
    function () {
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
        const canvas = document.getElementById('canvas1');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
