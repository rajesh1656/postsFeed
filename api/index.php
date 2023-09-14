<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'constants.php';
include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
$headers = getallheaders();
$path = explode('/', $_SERVER['REQUEST_URI']);
//print_r($headers);
if(!is_array($headers) 
    || !isset($headers['access_key'])
    || $headers['access_key'] != access_key
){
    echo json_encode(['status' => 0, 'message' => "Invalid request"]);die();
}
switch($path[2]) {
    case "posts":
        switch($method) {
            case "GET":
                try{
                    $sql = "SELECT id, title, description FROM posts";
                    if(isset($path[3]) && is_numeric($path[3])) {
                        $sql .= " WHERE id = :id";
                        $stmt = $conn->prepare($sql);
                        $stmt->bindParam(':id', $path[3]);
                        $stmt->execute();
                        $posts = $stmt->fetch(PDO::FETCH_ASSOC);
                    } else {
                        $sql .= " WHERE status = 1 order by id desc";
                        $page = 1;
                        $limit = 20;
                        if(isset($_GET['page']) && is_numeric($_GET['page'])) {
                            $page = $_GET['page'];
                        }
                        $sql .= " limit ".(($page-1)*$limit).", $limit";
                        $stmt = $conn->prepare($sql);
                        $stmt->execute();
                        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    }
                }catch(Exception $e){
                    // $response = ['status' => 0, 'message' => $e->getMessage()];
                    $posts = [];
                }

                echo json_encode($posts);
                break;
            case "POST":
                try{
                    $dateTime = date("Y-m-d H:i:s");
                    $user = json_decode( file_get_contents('php://input') );
                    $sql = "INSERT INTO posts(id, title, description, created_date) VALUES(null, :title, :description, :created_date)";
                    $stmt = $conn->prepare($sql);
                    $created_at = date('Y-m-d');
                    $stmt->bindParam(':title', $user->title);
                    $stmt->bindParam(':description', $user->description);
                    $stmt->bindParam(':created_date', $dateTime);

                    if($stmt->execute()) {
                        $response = ['status' => 1, 'message' => 'Post created successfully.'];
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to create post.'];
                    }
                }catch(Exception $e){
                    $response = ['status' => 0, 'message' => $e->getMessage()];
                }
                echo json_encode($response);
                break;

            case "PUT":
                try{
                    $user = json_decode( file_get_contents('php://input') );
                    $sql = "UPDATE posts SET title= :title, description =:description WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $updated_at = date('Y-m-d');
                    $stmt->bindParam(':id', $user->id);
                    $stmt->bindParam(':title', $user->title);
                    $stmt->bindParam(':description', $user->description);

                    if($stmt->execute()) {
                        $response = ['status' => 1, 'message' => 'Post updated successfully.'];
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to update post.'];
                    }
                }catch(Exception $e){
                    $response = ['status' => 0, 'message' => $e->getMessage()];
                }
                echo json_encode($response);
                break;

            case "DELETE":
                try{
                    // $sql = "DELETE FROM posts WHERE id = :id";
                    $sql = "update posts set status=0 WHERE id = :id";

                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':id', $path[3]);

                    if($stmt->execute()) {
                        $response = ['status' => 1, 'message' => 'Post deleted successfully.'];
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to delete post.'];
                    }
                }catch(Exception $e){
                    $response = ['status' => 0, 'message' => $e->getMessage()];
                }
                echo json_encode($response);
                break;
        }
        break;
        default: echo json_encode(['status' => 0, 'message' => "Invalid request"]);break;
    }