/**
 * Parse JSON data as a level
 * @param {any} data a JSON string containing the level data
 */
function parseLevel(data)
{
    const rawData = JSON.parse(data);

    rawData.entities.forEach(entity =>
    {
        world.appendChild(new Entity(entity.locX, entity.locY, res["black"], entity.extras));
    });
    /*
    rawData.backgrounds.forEach(background =>
    {
        world.appendChild(new Background(background.locX, background.locY, background.extras));
    });
    */

    rawData.ladders.forEach(ladder =>
    {
        const entity = new Entity(ladder.locX, ladder.locY, res["black"], ladder.extras);
        ladders.push(entity);
        world.appendChild(entity);
    });
}

/**
 * Reads a file asynchronously
 * @param {string} path the path to the file
 * @param {Function} callback the function to call back with the data
 */
function readFile(path, callback)
{
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", path, true);

    rawFile.onreadystatechange = () =>
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200)
            {
                callback(rawFile.responseText);
            }
            else
            {
                throw new Error(`Reading ${path}: ${rawFile.statusText}`);
            }
        }
    }

    rawFile.send(null);
}
