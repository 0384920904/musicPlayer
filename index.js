const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const heading_singer = $('header p');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,

    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: 'Bật tình yêu lên',
            singer: 'Tăng Duy Tân, Hòa Minzy',
            path: './music/song1.mp3',
            image: './img/song1.jpg'
        },
        {
            name: 'Ghệ iu dấu của em ơi',
            singer: 'tlinh, 2pillz, WOKEUP',
            path: './music/song2.mp3',
            image: './img/song2.jpg'
        },
        {
            name: 'Waiting for you',
            singer: 'MONO',
            path: './music/song3.mp3',
            image: './img/song3.jpg'
        },
        {
            name: 'See tình (Speedup Remix)',
            singer: 'Hoàng Thùy Linh',
            path: './music/song4.mp3',
            image: './img/song4.jpg'
        },
        {
            name: 'Ghé vào tai',
            singer: 'UMIE, Freaky, Hổ',
            path: './music/song5.mp3',
            image: './img/song5.jpg'
        },
        {
            name: 'Cô gái này là của ai',
            singer: 'Krix, Rush (Đoàn Quốc Vinh), Nhi Nhi',
            path: './music/song6.mp3',
            image: './img/song6.jpg'
        },
        {
            name: 'Rồi ta sẽ ngắm pháo hoa cùng nhau',
            singer: 'O.lew',
            path: './music/song7.mp3',
            image: './img/song7.jpg'
        },
        {
            name: 'Ngủ một minh',
            singer: 'HIEUTHUHAI, Negav, Kewtiie',
            path: './music/song8.mp3',
            image: './img/song8.jpg'
        },
        {
            name: 'Yêu 5',
            singer: 'Rhymastic',
            path: './music/song9.mp3',
            image: './img/song9.jpg'
        },
        {
            name: 'Chân ái',
            singer: 'Orange, Khói, Châu Đăng Khoa',
            path: './music/song10.mp3',
            image: './img/song10.jpg'
        }
    ],

    render: function () {
        const htmls = this.songs.map((song,index) => {
            return `<div class="song" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        });
        playlist.innerHTML = htmls.join('');
        $$('.song')[this.currentIndex].classList.add('active');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvent: function () {
        const _this = this;
        const csWidth = cd.offsetWidth;

        //Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 15000, //10s
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //Xử lí phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY;
            const newCdWidth = csWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / csWidth;
        }

        //Xử lí khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        //Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //Khi bài hát được pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Xử lí khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = e.target.value / 100 * audio.duration;
            audio.currentTime = seekTime;
        }

        //Khi next bài hát
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
            cdThumbAnimate.cancel();
            _this.activeSong();
            _this.scrollToActiveSong();
        }

        //Khi pre bài hát
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong();
            }
            audio.play();
            cdThumbAnimate.cancel();
            _this.activeSong();
            _this.scrollToActiveSong();
        }

        //Xử lí bật/tắt random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //Xử lí lặp lại một bài hát 
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //Xử lí next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        playlist.onclick = function (e) {
            const songElement = e.target.closest('.song:not(.active)');
            if (songElement || e.target.closest('.options')) {
                if (songElement) {
                    _this.currentIndex=Number(songElement.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.activeSong();
                    cdThumbAnimate.cancel();
                }
            }
        }

    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }, 200)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        heading_singer.textContent=this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    activeSong: function () {
        $('.song.active').classList.remove('active');
        $$('.song')[this.currentIndex].classList.add('active');
    },

    start: function () {
        //định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe / xử lí các sự kiện (DOM events)
        this.handleEvent();
        
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        //Render playlist 
        this.render();
    }
}

app.start();