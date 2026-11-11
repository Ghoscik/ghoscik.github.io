<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Item;
use App\Service\Router;
use App\Service\Templating;

class ItemController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $items = Item::findAll();
        $html = $templating->render('item/index.html.php', [
            'items' => $items,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestItem, Templating $templating, Router $router): ?string
    {
        if ($requestItem) {
            $item = Item::fromArray($requestItem);
            $item->save();

            $path = $router->generatePath('item-index');
            $router->redirect($path);
            return null;
        } else {
            $item = new Item();
        }

        $html = $templating->render('item/create.html.php', [
            'item' => $item,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $itemId, ?array $requestItem, Templating $templating, Router $router): ?string
    {
        $item = Item::find($itemId);
        if (! $item) {
            throw new NotFoundException("Missing item with id $itemId");
        }

        if ($requestItem) {
            $item->fill($requestItem);
            $item->save();

            $path = $router->generatePath('item-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('item/edit.html.php', [
            'item' => $item,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $itemId, Templating $templating, Router $router): ?string
    {
        $item = Item::find($itemId);
        if (! $item) {
            throw new NotFoundException("Missing item with id $itemId");
        }

        $html = $templating->render('item/show.html.php', [
            'item' => $item,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $itemId, Router $router): ?string
    {
        $item = Item::find($itemId);
        if (! $item) {
            throw new NotFoundException("Missing item with id $itemId");
        }

        $item->delete();
        $path = $router->generatePath('item-index');
        $router->redirect($path);
        return null;
    }
}
