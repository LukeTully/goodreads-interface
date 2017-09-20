import Vue from 'vue'
import App from './App.vue'

 window.state = {
            searchQuery: '',
            data: {},
            sortKey: 'popularity',
            sortOrder: 'up'
        }

        // Set up event handling for the search box
        var searchForm = document.querySelector('#search-form');
        var searchInput = document.querySelector('#author-search-input');

        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            state.searchQuery = searchInput.value;
            document.body.classList.add('active-search');
            queryForBooks(state.searchQuery);
        });

        // Query for books
        function queryForBooks(author) {
            var GoodreadsRequest = new Request(`/books?q=${author}`, {
                method: 'GET',
                headers: {
                    'Accepts': 'application/json'
                }
            });
            fetch(GoodreadsRequest).then(function (response) {
                return response.json();
            }).then(function (response) {
                state.data = response;
                // for (var key in response.list) {
                //     state.data.push(response.list[key]);
                // }
            });
        }

        // Create the root Vue instance
        var vm = new Vue({
            el: '#app-container',
            render: h => h(App)
        });