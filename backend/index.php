<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

error_reporting(-1);

$app = AppFactory::create();

$app->setBasePath('/juspuzzle');

$filePath = "data.json";

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
        return $response->withStatus(501);
    }
    $teamExists = findTeamByName($jsonData, $teamName);
    if ($teamExists) 
    {
        $response->getBody()->write("Team with name $teamName has already started");
        return $response->withStatus(501);
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

$app->run();

function findTeamByID($data, $id){
    foreach ( $data["teams"] as $element ) {
        if ( $id === $element['id'] ) {
            return $element;
        }
    }
    return false;
}
function findTeamByName($data, $name){
    foreach ( $data["teams"] as $element ) {
        if ( $name === $element['name'] ) {
            return $element;
        }
    }
    return false;
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