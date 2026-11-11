<?php
namespace App\Model;

use App\Service\Config;

class Item
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Item
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Item
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Item
    {
        $this->description = $description;
        return $this;
    }

    public static function fromArray($array): Item
    {
        $item = new self();
        $item->fill($array);
        return $item;
    }

    public function fill($array): Item
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM item';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $items = [];
        $itemsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($itemsArray as $itemArray) {
            $items[] = self::fromArray($itemArray);
        }
        return $items;
    }

    public static function find($id): ?Item
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM item WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $itemArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $itemArray) {
            return null;
        }
        return Item::fromArray($itemArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO item (name, description) VALUES (:name, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'description' => $this->getDescription(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE item SET name = :name, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM item WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);
        $this->setId(null);
        $this->setName(null);
        $this->setDescription(null);
    }
}
