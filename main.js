define([
    'base/js/namespace',
    'base/js/events'
], function(Jupyter, events) {

    var insert_cell = function() {
        Jupyter.notebook.
        insert_cell_below('code').
        set_text(`# HELLO from Snippet Manager!`);
        Jupyter.notebook.select_prev();
        //Jupyter.notebook.execute_cell_and_select_below();
    };
    // Function to add a welcome message when a new notebook is created
    var addWelcomeMessage = function() {
        Jupyter.notebook.insert_cell_at_index('markdown', 0).set_text('# Welcome to the  Snippet Manager!');
        Jupyter.notebook.execute_cells([0]);
    };
    // Add Toolbar button
    var snippetManagerButton = function() {
            console.log();
            Jupyter.toolbar.add_buttons_group([
                Jupyter.keyboard_manager.actions.register({
                    'help': 'Add snippet cell',
                    'icon': 'fa-paper-plane',
                    'handler': insert_cell
                }, 'addplanetjupyter-cell', 'Snippet Manager')
            ])
        }
        // Function to list all saved snippets
    var listSnippets = function() {
        // Your logic to list all saved snippets in a modal
        var snippets = Object.keys(localStorage);
        if (snippets.length === 0) {
            alert('No snippets saved yet!');
            return;
        }
        var modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.position = 'fixed';
        modal.style.zIndex = '1';
        modal.style.top = '300px';
        modal.style.width = '500px';
        modal.style.boxSizing = 'border-box';
        modal.style.marginInline = 'auto';
        var modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        // set padding 2rem, bo-sizing border-box, background-color white, border-radius 5px, box-shadow 0 0 10px rgba(0, 0, 0, 0.1)
        modalContent.style.padding = '2rem';
        modalContent.style.boxSizing = 'border-box';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '5px';
        modalContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

        var span = document.createElement('span');
        span.className = 'close';
        span.innerHTML = '&times;';
        span.onclick = function() {
            modal.style.display = 'none';
        };
        modalContent.appendChild(span);
        var ul = document.createElement('ul');
        snippets.forEach(function(snippet) {
            // create link to view code and delete snippet
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#';
            a.innerHTML = snippet;
            a.onclick = function() {
                var code = localStorage.getItem(snippet);
                // if current cell is markdown, insert cell below
                if (Jupyter.notebook.get_selected_cell().cell_type === 'markdown') {
                    Jupyter.notebook.insert_cell_below('code');
                }
                elif(Jupyter.notebook.get_selected_cell().cell_type === 'code') {
                    if (Jupyter.notebook.get_selected_cell().get_text() !== '') {
                        Jupyter.notebook.insert_cell_below('code');
                    } else {
                        Jupyter.notebook.get_selected_cell().set_text(code);
                    }
                }
                modal.style.display = 'none';
            };
            li.appendChild(a);
            ul.appendChild(li);

        });
        modalContent.appendChild(ul);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    };

    // Function to save snippet
    var saveSnippet = function() {
        // get the code from current cell
        var code = Jupyter.notebook.get_selected_cell().get_text();
        // show popup to allow use to set snippet short code
        var shortCode = prompt("Enter a short code for this snippet");
        if (!shortCode) {
            return;
        }
        // save the snippet to local storage
        localStorage.setItem(shortCode, code);
        // show success message
        alert("Snippet saved successfully!");
    };

    // Add Toolbar buttons
    var addButtons = function() {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Add snippet cell',
                'icon': 'fa-paper-plane',
                'handler': insert_cell
            }, 'addplanetjupyter-cell', 'Snippet Manager'),
            Jupyter.keyboard_manager.actions.register({
                'help': 'List Saved Snippets',
                'icon': 'fa-list',
                'handler': listSnippets
            }, 'list-saved-snippets', 'Snippet Manager'),
            Jupyter.keyboard_manager.actions.register({
                'help': 'Save Snippet',
                'icon': 'fa-save',
                'handler': saveSnippet
            }, 'save-snippet', 'Snippet Manager')
        ]);
    };


    // Run on start
    function load_ipython_extension() {
        // Add a default cell if there are no cells
        if (Jupyter.notebook.get_cells().length === 1) {
            addWelcomeMessage()
        }
        addButtons()
    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});