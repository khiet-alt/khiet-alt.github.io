(function(global){
    var dc = {};

    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl = "http://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";
    var menuItemsUrl = "http://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";

    var insertHtml = function(selector, html){
        var targetElm = document.querySelector(selector);
        targetElm.innerHTML = html;
    };

    //return substitue of '{{propName}} with propValue in given 'string'
    var insertProperty = function(string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;  
    }

    var showLoading = function(selector){
        var html = "<div class='text-center'>";
        html += "<img src='gif/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    document.addEventListener('DOMContentLoaded', (event) =>{
        
        /*collapse dropdown when lose active*/
        document
            .querySelector("#navbarToggle")
            .addEventListener("blur", (event) =>{
                var screenWidth = window.innerWidth;
                if (screenWidth < 768) {
                    $("#navbarTogglerDemo02").collapse('hide'); //use Jquery
                }
            });
        /*---------------------------------*/

        var switchMenuToActive = function() {
            // Remove "active" from home button
            var classes = document.querySelector("#navHomeButton").className;
            classes = classes.replace(new RegExp("active", "g"), "");
            document.querySelector("#navHomeButton").className = classes;
            // Add "active" to menu button if not already there
            classes = document.querySelector("#navMenuButton").className;
            if (classes.indexOf("active") == -1) {
                classes += " active";
                document.querySelector("#navMenuButton").className = classes;
            }
        }

        /* build main-content for index.html */
        //on first load, show home view
        dc.loadBackground = () => {
            showLoading("#main-content");
            $ajaxUtils.sendGetRequest(homeHtml, (responseText)=>{
                document.querySelector("#main-content")
                        .innerHTML = responseText.responseText;            
            },
            false); // don't want pre-process this as JSON because
                    //it just a HTML snippet
        }
        dc.loadBackground();
        /*---------------------------------*/
        //Load the menu categories view
        dc.loadMenuCategories = () => {
            showLoading("#main-content");
            $ajaxUtils.sendGetRequest(
                allCategoriesUrl, buildAndShowCategoriesHTML);
        };

        /* build menu-categories.html */
        
        function buildAndShowCategoriesHTML (categories) {
            $ajaxUtils.sendGetRequest(
                categoriesTitleHtml, function(categoriesTitleHtml) {
                    $ajaxUtils.sendGetRequest(categoryHtml, (categoryHtml)=>{
                        var categoriesViewHtml = buildCategoriesViewHtml(
                                                categories, 
                                                categoriesTitleHtml, 
                                                categoryHtml);
                        insertHtml("#main-content", categoriesViewHtml);
                    }, false);
                },
            false);
        }

        function buildCategoriesViewHtml(categories, categoriesTitleHtml,
                                         categoryHtml) {
            var finalHtml = categoriesTitleHtml.responseText;
            finalHtml += "<section class='row'>";

            var obj = JSON.parse(categories.response); // convert json from..
                                                       // to object

            for(var i = 0; i < obj.length; i++) {
                var html = categoryHtml.responseText;
                var name = "" + obj[i].name;
                var short_name = obj[i].short_name;
                html = insertProperty(html, "name", name);
                html = insertProperty(html, "short_name", short_name);
                finalHtml += html;
            }
            finalHtml += "</section>";
            return finalHtml;
        }
        /* --------------------------------- */

        /* build single-categories.html */

        //Load single-category view
        //'categoryShort' is a short_name for a category        
        dc.loadMenuItems = (categoryShort) =>{
            showLoading("#main-content");
            $ajaxUtils
                .sendGetRequest(menuItemsUrl + categoryShort,
                                buildAndShowMenuItemsHTML);
        }

        function buildAndShowMenuItemsHTML (categoryMenuItems) {
            $ajaxUtils.sendGetRequest(menuItemsTitleHtml, (menuItemsTitleHtml)=>{
                $ajaxUtils.sendGetRequest(menuItemHtml, (menuItemHtml)=>{
                    var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems,
                                                                   menuItemsTitleHtml,
                                                                   menuItemHtml);
                    insertHtml("#main-content", menuItemsViewHtml);
                },false);
            },false);
        }

        function buildMenuItemsViewHtml (categoryMenuItems, 
                                         menuItemsTitleHtml,
                                         menuItemHtml) {
            var obj = JSON.parse(categoryMenuItems.responseText);
            var title = menuItemsTitleHtml.responseText;

            title = insertProperty(title, "name", obj.category.name);
            title = insertProperty(title, "special_instructions", obj.category.special_instructions);
            
            var finalHtml = title;
            finalHtml += "<section class='row'>";
            
            var menuItems = obj.menu_items;
            var catShortName = obj.category.short_name;
            for(var i = 0; i < menuItems.length; i++) {
                var html = menuItemHtml.responseText;
                html = insertProperty(html, "short_name", menuItems[i].short_name);
                html = insertProperty(html, "catShortName", catShortName);
                html = insertProperty(html, "price_small", menuItems[i].price_small);
                html = insertProperty(html, "small_portion_name", menuItems[i].small_portion_name);
                html = insertProperty(html, "price_large", menuItems[i].price_large);
                html = insertProperty(html, "large_portion_name", menuItems[i].large_portion_name);
                html = insertProperty(html, "name", menuItems[i].name);
                html = insertProperty(html, "description", menuItems[i].description);
                
                finalHtml += html;
            }
            
            finalHtml += "</section>";
            return finalHtml;
        }

        function insertItemPrice(html, pricePropName, priceValue) {
            if (!priceValue) 
                return insertProperty(html, pricePropName, "");
            priceValue = "$" + priceValue.toFixed(2);
            html = insertProperty(html, pricePropName, priceValue);
            return html;
        }

    });

    global.$dc = dc;

})(window);

