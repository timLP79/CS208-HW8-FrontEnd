console.log('classes.show.js is executing...');

/**
 * This code is executed after the page loads.
 * If the URL of the page is
 *      classes.show.html?class_id=123
 * then extract the class_id parameter and its value (i.e., 123) from the URL
 */
document.addEventListener("DOMContentLoaded", function ()
{
    const currentURL = new URL(window.location.href);
    console.log(`url = ${currentURL}`);

    const class_id = currentURL.searchParams.get("class_id");
    console.log(`class_id = ${class_id}`);

    document.getElementById("instructions_show_class_details").innerHTML=`
        <p>class_id extracted from the URL = ${class_id}</p>
        <h3>TODO EXTRA CREDIT</h3>
        <p>make a call to the API to retrieve the class with id ${class_id}</p>
        <p>
            display the content of the class retrieved from the API inside the 'classes.show.html',
            inside the div with id="show_class_details"
        </p>
    `;
});
