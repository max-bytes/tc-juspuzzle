<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Slim\Exception\HttpNotFoundException;

require __DIR__ . '/vendor/autoload.php';

error_reporting(-1);

$app = AppFactory::create();

$app->setBasePath('/juspuzzle');
$app->addBodyParsingMiddleware();

$filePath = "data.json";
$filePathPuzzle = "solved_puzzles.json";

// $app->get('/hello/{name}', function (Request $request, Response $response, array $args) {
//     $name = $args['name'];
//     $response->getBody()->write("Hello, $name");
//     return $response;
// });

$app->get('/teams', function (Request $request, Response $response, array $args) use ($filePath) {

    $jsonString = file_get_contents($filePath);
    if ($jsonString === false)
    {
        $response->getBody()->write("Error reading file");
        return $response->withStatus(501);
    }

    $jsonData = json_decode($jsonString, true);
    if ($jsonData === null)
    {
        $response->getBody()->write("Error parsing file");
        return $response->withStatus(501);
    }

    $body = json_encode($jsonData);

    $response->getBody()->write($body);
    return $response->withHeader('Content-type', 'application/json');
});

$app->get('/solved_puzzles', function (Request $request, Response $response, array $args) use ($filePathPuzzle) {

    $jsonString = file_get_contents($filePathPuzzle);
    if ($jsonString === false)
    {
        $response->getBody()->write("Error reading file");
        return $response->withStatus(501);
    }

    $jsonData = json_decode($jsonString, true);
    if ($jsonData === null)
    {
        $response->getBody()->write("Error parsing file");
        return $response->withStatus(501);
    }

    $body = json_encode($jsonData);

    $response->getBody()->write($body);
    return $response->withHeader('Content-type', 'application/json');
});


$app->post('/start', function (Request $request, Response $response, array $args) use ($filePath) {

    $params = (array)$request->getParsedBody();

    $teamID = $params['id'] ?? null;
    if ($teamID === null) {
        $response->getBody()->write("Invalid team ID specified");
        return $response->withStatus(501);
    }
    $teamID = intval($teamID, 10);
    $teamName = $params['name'] ?? null;
    if ($teamName === null) {
        $response->getBody()->write("Invalid team name specified");
        return $response->withStatus(501);
    }

    $startTime = date("c");

    $jsonString = file_get_contents($filePath);
    if ($jsonString === false)
    {
        $response->getBody()->write("Error reading file");
        return $response->withStatus(501);
    }

    $jsonData = json_decode($jsonString, true);
    if ($jsonData === null)
    {
        $response->getBody()->write("Error parsing file");
        return $response->withStatus(501);
    }

    $teamExists = findTeamByID($jsonData, $teamID);
    if ($teamExists) 
    {
        $response->getBody()->write("Team with id $teamID has already started");
        return $response->withStatus(200); // this is actually ok, we permit this
    }
    $teamExists = findTeamByName($jsonData, $teamName);
    if ($teamExists) 
    {
        $response->getBody()->write("Team with name $teamName has already started");
        return $response->withStatus(400);
    }

    array_push($jsonData["teams"], [
        "id" => $teamID,
        "name" => $teamName,
        "startTime" => $startTime,
    ]);

    if (file_put_contents($filePath, json_encode($jsonData, JSON_PRETTY_PRINT )) === false) {
        $response->getBody()->write("Could not write file");
        return $response->withStatus(501);
    }

    return $response;
});

$app->post('/stop', function (Request $request, Response $response, array $args) use ($filePath) {

    $params = (array)$request->getParsedBody();

    $teamID = $params['id'] ?? null;
    if ($teamID === null) {
        $response->getBody()->write("Invalid team ID specified");
        return $response->withStatus(501);
    }
    $teamID = intval($teamID, 10);


    $jsonString = file_get_contents($filePath);
    if ($jsonString === false)
    {
        $response->getBody()->write("Error reading file");
        return $response->withStatus(501);
    }

    $jsonData = json_decode($jsonString, true);
    if ($jsonData === null)
    {
        $response->getBody()->write("Error parsing file");
        return $response->withStatus(501);
    }

    $teamExists =& findTeamByID($jsonData, $teamID);
    if (!$teamExists) 
    {
        $response->getBody()->write("Team with id $teamID does not exist");
        return $response->withStatus(501);
    }

    $endTime = date("c");
    $teamExists['endTime'] = $endTime;

    if (file_put_contents($filePath, json_encode($jsonData, JSON_PRETTY_PRINT )) === false) {
        $response->getBody()->write("Could not write file");
        return $response->withStatus(501);
    }

    return $response;
});


$app->post('/reset-rankings', function (Request $request, Response $response, array $args) use ($filePath) {
    $jsonData = ["teams" => []];
    if (file_put_contents($filePath, json_encode($jsonData, JSON_PRETTY_PRINT )) === false) {
        $response->getBody()->write("Could not write file");
        return $response->withStatus(501);
    }
    return $response;
});

$app->post('/solve', function (Request $request, Response $response, array $args) use ($filePathPuzzle) {
    $params = (array)$request->getParsedBody();

    $puzzleID = $params['id'] ?? null;
    if ($puzzleID === null) {
        $response->getBody()->write("Invalid puzzle ID specified");
        return $response->withStatus(501);
    }
    $puzzleID = intval($puzzleID, 10);

    $jsonString = file_get_contents($filePathPuzzle);
    if ($jsonString === false)
    {
        $response->getBody()->write("Error reading file");
        return $response->withStatus(501);
    }

    $jsonData = json_decode($jsonString, true);
    if ($jsonData === null)
    {
        $response->getBody()->write("Error parsing file");
        return $response->withStatus(501);
    }

    $jsonData[] = $puzzleID;

    if (file_put_contents($filePathPuzzle, json_encode($jsonData, JSON_PRETTY_PRINT )) === false) {
        $response->getBody()->write("Could not write file");
        return $response->withStatus(501);
    }

    return $response;
});


$app->post('/unsolve', function (Request $request, Response $response, array $args) use ($filePathPuzzle) {
    $params = (array)$request->getParsedBody();

    $puzzleID = $params['id'] ?? null;
    if ($puzzleID === null) {
        $response->getBody()->write("Invalid puzzle ID specified");
        return $response->withStatus(501);
    }
    $puzzleID = intval($puzzleID, 10);

    $jsonString = file_get_contents($filePathPuzzle);
    if ($jsonString === false)
    {
        $response->getBody()->write("Error reading file");
        return $response->withStatus(501);
    }

    $jsonData = json_decode($jsonString, true);
    if ($jsonData === null)
    {
        $response->getBody()->write("Error parsing file");
        return $response->withStatus(501);
    }

    $jsonData = array_values(array_filter($jsonData, function($i) use ($puzzleID) {
        return $i !== $puzzleID;
    }));

    if (file_put_contents($filePathPuzzle, json_encode($jsonData, JSON_PRETTY_PRINT )) === false) {
        $response->getBody()->write("Could not write file");
        return $response->withStatus(501);
    }

    return $response;
});

$app->options('/{routes:.+}', function ($request, $response, $args) {
    return $response;
});
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : null;
    $allowedOrigin = 'http://localhost:3000';
    if ($origin === 'https://max-bytes.github.io')
        $allowedOrigin = $origin;
    return $response
            ->withHeader('Access-Control-Allow-Origin', $allowedOrigin)
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

/**
 * Catch-all route to serve a 404 Not Found page if none of the routes match
 * NOTE: make sure this route is defined last
 */
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', function ($request, $response) {
    throw new HttpNotFoundException($request);
});

$app->run();

function & findTeamByID(&$data, $id){

    foreach ( $data["teams"] as &$element ) {
        if ( $id === $element['id'] ) {
            return $element;
        }
    }
    $null = null;
    return $null;
}
function & findTeamByName(&$data, $name){
    foreach ( $data["teams"] as &$element ) {
        if ( $name === $element['name'] ) {
            return $element;
        }
    }
    $null = null;
    return $null;
}

/*
example data structure
{
    "teams": [
        {
            "id": 1,
            "name": "A-Team",
            "startTime": "2024-28-10T12:00:00Z"
        },
        {
            "id": 2,
            "name": "B-Team",
            "startTime": "2024-28-10T12:00:00Z",
            "endTime": "2024-28-10T13:00:00Z"
        }
    ]
}
*/