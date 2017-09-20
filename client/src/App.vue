<template>
    <div id="app-container">

        <template v-if="searchQuery">
            <div v-for="book in filteredBooks" class="book-tile">
                <h2>{{book.title[0]}}</h2>
                <div>
                    <img src="/assets/images/6442769.jpg" />
                    <ul>
                        <li>{{book.average_rating[0]}}</li>
                        <li v-if="book.num_pages[0]">{{book.num_pages[0]}}</li>
                        <li>
                            <a :href="book.link[0]">{{book.link[0]}}</a>
                        </li>
                    </ul>
                    <ul>
                        <li v-for="authorList in book.authors">
                            <template v-for="author in authorList">
                                <template v-for="author in author">
                                    <template v-for="name in author['name']">
                                        {{name}}
                                    </template>
                                </template>
                            </template>
                        </li>
                    </ul>

                </div>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'app',
    data() {
        // References global state object for now
        return state;
    },
    methods: {
        sortBooks: function(key, data) {
            switch (key) {
                case 'popularity':
                    return data.sort(function(a, b) {
                        var firstRating = parseInt(a.ratings_count[0], 10);
                        var secondRating = parseInt(b.ratings_count[0], 10);

                        if (firstRating > secondRating) {
                            return 1;
                        }
                        if (firstRating < secondRating) {
                            return -1;
                        }
                        return 0;
                    });
                    break;
                default:
                    return data

            }
        }
    },
    computed: {
        books: function() {
            if (!Array.isArray(this.data)) {
                return this.data;
            }
            // Correct the existance of a large image in the book dataset
            return this.data.map(function(item) {
                // Just doing a simple check here because the API returns a blank string.
                if (!item.large_image_url[0]) {
                    // Again, simple check intentionally
                    if (item.image_url.length > 0 && item.image_url[0].indexOf('nophoto') === -1) {
                        // JS' sense of a url parsing library
                        var url = document.createElement('a');

                        url.href = item.image_url[0];

                        var splitUrl = url.pathname.split('/');
                        // Access the second last segment which contains the direct name
                        var directorySegment = splitUrl[splitUrl.length - 2];

                        // Check the last character for an indication that the largest image in the array is medium
                        if (directorySegment[directorySegment.length - 1] === 'm') {

                            // Replace it
                            var splitSeg = directorySegment.split('');
                            splitSeg[splitSeg.length - 1] = 'l';

                            // Reassign
                            splitUrl[splitUrl.length - 2] = splitSeg.join('');

                        }

                        // Piece the URL back together
                        url.pathname = splitUrl.join('/');
                        item.large_image_url[0] = url.href;
                    }
                }

                return item;
            });
        },
        filteredBooks: function() {
            if (!Array.isArray(this.books)) {
                return this.books;
            }
            var filteredBooks = this.sortBooks(this.sortKey, this.books, this.sortOrder);
            if (this.sortOrder === 'down') {
                return filteredBooks;
            }
            return filteredBooks.reverse();
        },
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

h1,
h2 {
    font-weight: normal;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
