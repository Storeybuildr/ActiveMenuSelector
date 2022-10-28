// eslint-disable-next-line no-unused-vars
import React, { createElement, useEffect, useState } from "react";

function componentShouldUpdate(current, next) {}

React.memo(MenuSelector, componentShouldUpdate);

const ActiveMenuSelector = props => <MenuSelector props={props} />;
export default ActiveMenuSelector;

function MenuSelector({ props }) {
    const [menu, setMenu] = useState();

    // Menu properties
    const menuWidgetName = props.menuWidgetName;
    const menuItemTitle = props.menuItemTitle.value;

    const napTime = ms => new Promise(res => setTimeout(res, ms));

    // componentDidMount() {
    useEffect(() => {
        async function setActiveMenu() {
            let delay = 50;
            const delayIncrement = 50;

            let retryCount = 0;
            const maxRetries = 6;

            await napTime(500);

            // Sometimes the menu hasn't loaded yet. Try ${maxRetries} times to get it and then give up.
            // Very rarely does it go beyond the first retry.
            let _menu;
            while (retryCount < maxRetries) {
                _menu = document.querySelector(`.mx-name-${menuWidgetName}`);

                if (_menu) {
                    break;
                }
                retryCount++;
                delay += delayIncrement;
                await napTime(delay);
            }

            // Fail if no menu found within retry limit
            if (!_menu) {
                console.error(`ActiveMenuSelector widget could not find menu: ${menuWidgetName}`);
                return;
            }

            // Remove the active state from any/all of the menu items
            if (_menu.querySelector(".active") !== null) {
                const activeItems = _menu.querySelectorAll(".active");
                activeItems.forEach(menuItem => menuItem.classList.remove("active"));
            }

            // Add the active state back to the one that matches your target title
            const targetItem = _menu.querySelector(`a[title='${menuItemTitle}']`);
            if (targetItem) {
                // Top nav menu requires the parent (li) to have the active class
                targetItem.classList.add("active");
                targetItem.setAttribute("id", "left-nav-active-item");
                // Left nav tree requires the (a) element to have the active class
                targetItem.parentNode.classList.add("active");
                targetItem.parentNode.setAttribute("id", "left-nav-active-item");
            } else {
                console.error(
                    `ActiveMenuSelector widget could not find target: ${menuItemTitle} in menu: ${menuWidgetName}`
                );
            }

            setMenu(_menu);
        }
        setActiveMenu();
    }, [menu, menuItemTitle, menuWidgetName]);

    return <></>;
}
