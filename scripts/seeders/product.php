<?php

declare(strict_types=1);

namespace Scripts\Seeders;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductAttribute;
use BaseApi\App;
use Faker\Factory as FakerFactory;

App::boot(__DIR__ . '/../..');

$count = (int)($argv[1] ?? 500);
$imagesPerProduct = (int)($argv[2] ?? 3); // Number of images per product

$faker = FakerFactory::create('en_US');

// Ensure storage/public directory exists
$storagePublicPath = __DIR__ . '/../../storage/public';
if (!is_dir($storagePublicPath)) {
    mkdir($storagePublicPath, 0755, true);
    echo "Created storage/public directory\n";
}

// Create products subdirectory
$productsImagePath = $storagePublicPath . '/products';
if (!is_dir($productsImagePath)) {
    mkdir($productsImagePath, 0755, true);
    echo "Created storage/public/products directory\n";
}

/**
 * Download an image from a URL and save it to a file
 */
function downloadImage(string $url, string $filepath): bool
{
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ],
    ]);
    
    $imageData = @file_get_contents($url, false, $context);
    if ($imageData === false) {
        return false;
    }
    
    return file_put_contents($filepath, $imageData) !== false;
}

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

    // Download and save product images
    $numImages = $faker->numberBetween(1, $imagesPerProduct);
    for ($j = 0; $j < $numImages; $j++) {
        // Use picsum.photos for random product images
        // Vary dimensions slightly for variety
        $width = $faker->randomElement([800, 1000, 1200]);
        $height = $faker->randomElement([600, 800, 1000]);
        
        $imageFilename = sprintf('product_%s_%d.jpg', $p->id, $j + 1);
        $imagePath = $productsImagePath . '/' . $imageFilename;
        
        // Download the image
        $imageUrl = sprintf('https://picsum.photos/%d/%d', $width, $height);
        $downloaded = downloadImage($imageUrl, $imagePath);
        
        if ($downloaded) {
            // Create ProductImage record
            $productImage = new ProductImage();
            $productImage->product_id = $p->id;
            $productImage->image_path = 'storage/products/' . $imageFilename;
            $productImage->save();
        }
    }

    // Create product attributes
    $attributeTypes = [
        'Color' => ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Gray', 'Rose Gold', 'Navy', 'Beige', 'Brown'],
        'Material' => ['Aluminum', 'Steel', 'Plastic', 'Leather', 'Cotton', 'Polyester', 'Silicone', 'Glass', 'Wood', 'Ceramic', 'Carbon Fiber'],
        'Size' => ['Small', 'Medium', 'Large', 'X-Large', 'Compact', 'Standard', 'Premium'],
        'Weight' => ['Lightweight', 'Standard', 'Heavy-duty', '100g', '200g', '500g', '1kg', '2kg'],
        'Warranty' => ['1 Year', '2 Years', '3 Years', '5 Years', 'Lifetime', '90 Days'],
        'Brand' => ['TechPro', 'Premium', 'Elite', 'Classic', 'Modern', 'Essential', 'Deluxe'],
        'Origin' => ['USA', 'Germany', 'Japan', 'Italy', 'France', 'UK', 'Switzerland', 'Sweden'],
        'Dimensions' => ['10x5x2cm', '15x10x5cm', '20x15x10cm', '25x20x15cm', '30x25x20cm'],
    ];

    // Add 2-5 random attributes per product
    $numAttributes = $faker->numberBetween(2, 5);
    $selectedAttributeTypes = $faker->randomElements(array_keys($attributeTypes), $numAttributes);
    
    foreach ($selectedAttributeTypes as $attributeType) {
        $attributeValue = $faker->randomElement($attributeTypes[$attributeType]);
        
        $productAttribute = new ProductAttribute();
        $productAttribute->product_id = $p->id;
        $productAttribute->attribute = $attributeType;
        $productAttribute->value = $attributeValue;
        $productAttribute->save();
    }

    if (($i + 1) % 10 === 0) echo ($i + 1) . PHP_EOL;
}

echo 'Seeded ' . $count . ' products.' . PHP_EOL;
