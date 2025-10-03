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
$variantPercentage = 0.3; // 30% of products will have variants

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
$variantGroups = []; // Track variant groups
$productsCreated = 0;

for ($i = 0; $i < $count; $i++) {
    // Decide if this product should be part of a variant group
    $shouldCreateVariant = $faker->boolean($variantPercentage * 100);
    $variantGroupId = null;
    $baseTitle = '';
    $baseDescription = '';
    $basePrice = 0.0;
    
    if ($shouldCreateVariant && count($variantGroups) > 0 && $faker->boolean(70)) {
        // Add to existing variant group (70% chance if groups exist)
        $variantGroupId = $faker->randomElement(array_keys($variantGroups));
        $baseTitle = $variantGroups[$variantGroupId]['title'];
        $baseDescription = $variantGroups[$variantGroupId]['description'];
        $basePrice = $variantGroups[$variantGroupId]['price'];
    } else if ($shouldCreateVariant) {
        // Create new variant group
        $variantGroupId = $faker->uuid;
        
        $tries = 0;
        do {
            $baseTitle = $faker->randomElement($adjectives) . ' ' . $faker->randomElement($materials) . ' ' . $faker->randomElement($nouns);
            if ($faker->boolean(40)) $baseTitle .= ' ' . $faker->randomElement($series);
            if ($faker->boolean(30)) $baseTitle .= ' ' . $faker->numberBetween(2, 9);
            $tries++;
        } while (isset($titles[$baseTitle]) && $tries < 5);
        
        $baseDescription = $faker->catchPhrase . '. ' . implode(' ', $faker->paragraphs($faker->numberBetween(1, 3)));
        $basePrice = (float)number_format($faker->randomFloat(2, 4.99, 2499.0), 2, '.', '');
        if ($faker->boolean(10)) $basePrice = (float)number_format($basePrice * 0.8, 2, '.', '');
        
        $variantGroups[$variantGroupId] = [
            'title' => $baseTitle,
            'description' => $baseDescription,
            'price' => $basePrice,
            'count' => 0,
        ];
    }
    
    // Generate product title (with variant name if applicable)
    if ($variantGroupId) {
        $title = $baseTitle;
        $description = $baseDescription;
        $price = $basePrice;
        // Add slight price variation for variants
        if ($variantGroups[$variantGroupId]['count'] > 0) {
            $priceVariation = $faker->randomFloat(2, -50, 100);
            $price = max(4.99, $price + $priceVariation);
        }
        $variantGroups[$variantGroupId]['count']++;
    } else {
        // Regular product without variants
        $tries = 0;
        do {
            $title = $faker->randomElement($adjectives) . ' ' . $faker->randomElement($materials) . ' ' . $faker->randomElement($nouns);
            if ($faker->boolean(40)) $title .= ' ' . $faker->randomElement($series);
            if ($faker->boolean(30)) $title .= ' ' . $faker->numberBetween(2, 9);
            $tries++;
        } while (isset($titles[$title]) && $tries < 5);
        if (isset($titles[$title])) $title .= ' ' . strtoupper($faker->bothify('##?'));
        
        $description = $faker->catchPhrase . '. ' . implode(' ', $faker->paragraphs($faker->numberBetween(1, 3)));
        $price = (float)number_format($faker->randomFloat(2, 4.99, 2499.0), 2, '.', '');
        if ($faker->boolean(10)) $price = (float)number_format($price * 0.8, 2, '.', '');
    }
    
    $titles[$title] = true;

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
    $p->variant_group = $variantGroupId;
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
    
    // For variants, ensure they have differentiating attributes
    if ($p->variant_group !== null && !in_array('Color', $selectedAttributeTypes)) {
        $selectedAttributeTypes[] = 'Color';
    }
    if ($p->variant_group !== null && !in_array('Size', $selectedAttributeTypes) && $faker->boolean(60)) {
        $selectedAttributeTypes[] = 'Size';
    }
    
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

// Output summary
$totalVariantGroups = count($variantGroups);
$totalVariants = array_sum(array_column($variantGroups, 'count'));

echo 'Seeded ' . $count . ' products.' . PHP_EOL;
echo 'Created ' . $totalVariantGroups . ' variant groups with ' . $totalVariants . ' total variants.' . PHP_EOL;
