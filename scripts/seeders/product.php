<?php

declare(strict_types=1);

namespace Scripts\Seeders;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\Product;
use BaseApi\App;
use Faker\Factory as FakerFactory;

App::boot(__DIR__ . '/../..');

$count = (int)($argv[1] ?? 500);

$faker = FakerFactory::create('en_US');

$adjectives = ['Ultra', 'Smart', 'Compact', 'Portable', 'Premium', 'Classic', 'Eco', 'Wireless', 'Pro', 'Mini', 'Max', 'Advanced', 'Elegant', 'Rugged', 'Silent', 'Rapid', 'Crystal', 'Aero', 'Magnetic', 'Fusion'];
$materials = ['Steel', 'Aluminum', 'Carbon', 'Bamboo', 'Titanium', 'Ceramic', 'Glass', 'Leather', 'Wool', 'Cotton', 'Silicone', 'Granite', 'Oak', 'Maple'];
$nouns = ['Speaker', 'Headphones', 'Backpack', 'Watch', 'Lamp', 'Mug', 'Notebook', 'Keyboard', 'Mouse', 'Chair', 'Table', 'Bottle', 'Camera', 'Tripod', 'Charger', 'Power Bank', 'Router', 'Drone', 'Sunglasses', 'Wallet'];
$series = ['S', 'X', 'Z', 'Prime', 'Edge', 'Plus', 'Lite', 'Air', 'Go'];

$titles = [];
for ($i = 0; $i < $count; $i++) {
    $tries = 0;
    do {
        $title = $faker->randomElement($adjectives) . ' ' . $faker->randomElement($materials) . ' ' . $faker->randomElement($nouns);
        if ($faker->boolean(40)) $title .= ' ' . $faker->randomElement($series);
        if ($faker->boolean(30)) $title .= ' ' . $faker->numberBetween(2, 9);
        $tries++;
    } while (isset($titles[$title]) && $tries < 5);
    if (isset($titles[$title])) $title .= ' ' . strtoupper($faker->bothify('##?'));
    $titles[$title] = true;

    $description = $faker->catchPhrase . '. ' . implode(' ', $faker->paragraphs($faker->numberBetween(1, 3)));

    $price = (float)number_format($faker->randomFloat(2, 4.99, 2499.0), 2, '.', '');
    if ($faker->boolean(10)) $price = (float)number_format($price * 0.8, 2, '.', '');

    $stock = $faker->biasedNumberBetween(0, 250, function ($x) {
        return 1 - sqrt($x / 250);
    });
    $views = $faker->numberBetween(0, 20000);

    $p = new Product();
    $p->title = $title;
    $p->description = $description;
    $p->price = $price;
    $p->stock = (int)$stock;
    $p->views = (int)$views;
    $p->save();

    if (($i + 1) % 100 === 0) echo ($i + 1) . PHP_EOL;
}

echo 'Seeded ' . $count . ' products.' . PHP_EOL;
