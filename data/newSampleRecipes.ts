import { Recipe } from '../types/Recipe';

export const sampleRecipes: Recipe[] = [
    {
        "uuid": "04b41443-b5fb-4589-a99e-30474b7482e2",
        "name": "Bacalhau à Bras",
        "description": "Un plat traditionnel portugais savoureux et réconfortant fait avec de la morue dessalée, des pommes de terre, des oignons et des œufs.",
        "price": 0,
        "quantity": 4,
        "number_of_persons": 4,
        "origin_country": "Portugal",
        "attributes": [
            "Traditionnel",
            "Facile à préparer"
        ],
        "process": [
            {
                "name": null,
                "recipe_uuid": null,
                "utensils": [
                    "Poêle",
                    "Casserole",
                    "Fourchette"
                ],
                "ingredients": [
                    {
                        "name": "Morue dessalée",
                        "quantity": 500,
                        "unit": "g",
                    },
                    {
                        "name": "Pommes de terre",
                        "quantity": 500,
                        "unit": "g"
                    },
                    {
                        "name": "Oignons",
                        "quantity": 2,
                        "unit": "unité",
                    },
                    {
                        "name": "Ail",
                        "quantity": 2,
                        "unit": "gousse"
                    },
                    {
                        "name": "Huile d'olive",
                        "quantity": 50,
                        "unit": "ml"
                    },
                    {
                        "name": "Oeufs",
                        "quantity": 4,
                        "unit": "unité"
                    },
                    {
                        "name": "Persil frais",
                        "quantity": 1,
                        "unit": "branche"
                    },
                    {
                        "name": "Sel",
                        "quantity": 0,
                        "unit": ""
                    },
                    {
                        "name": "Poivre noir",
                        "quantity": 0,
                        "unit": ""
                    }
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "description": "Faire bouillir de l'eau et cuire la morue pendant environ 5 minutes. La retirer ensuite et la laisser refroidir.",
                        "duration": 300,
                        "title": "bouillir l'eau",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 2,
                        "description": "Eplucher et couper les pommes de terre en fines tranches. Les faire cuire à l'eau bouillante salée jusqu'à ce qu'elles soient tendres.",
                        "duration": 900,
                        "title": "preparation pomme de terre",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 3,
                        "description": "Eplucher et hacher les oignons. Hacher également l'ail.",
                        "duration": 300,
                        "title": "preparation oignon et ail",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 4,
                        "description": "Faire chauffer l'huile d'olive dans une grande poêle. Ajouter les oignons et l'ail et faire revenir jusqu'à ce qu'ils soient translucides.",
                        "duration": 300,
                        "title": "faire revenir oignon et ail",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 5,
                        "description": "Déchiqueter la morue cuite en morceaux. L'ajouter à la poêle avec les oignons et l'ail.",
                        "duration": 120,
                        "title": "ajouter morue",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 6,
                        "description": "Ajouter les pommes de terre cuites à la poêle. Bien mélanger.",
                        "duration": 120,
                        "title": "1ajouter pomme de terre",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 7,
                        "description": "Casser les oeufs dans un bol et battre légèrement. Verser les oeufs battus sur le mélange de poisson et de pommes de terre.",
                        "duration": 120,
                        "title": "battre les oeufs",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 8,
                        "description": "Cuire à feu doux pendant environ 5 minutes, en remuant délicatement, jusqu'à ce que les oeufs soient cuits. Saler et poivrer selon le goût.",
                        "duration": 300,
                        "title": "cuire a feu doux",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    },
                    {
                        "step_number": 9,
                        "description": "Saupoudrer de persil frais haché avant de servir.",
                        "duration": 60,
                        "title": "ajouter persil",
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                    }
                ]
            }
        ],
        "thumbnail_url": null,
        "large_image_url": null,
        "source_reference": "https://www.voyage-a-lisbonne.com/single-post/la-meilleure-recette-de-morue-le-bacalhau-a-bras",
        "difficulty": null,
        "created_by": "a32794ea-34e2-4a9d-9d25-507bccdbfe4c"
    },
    {
        "uuid": "a32794ea-31e2-4a9d-9d25-495bccdbfe4c",
        "name": "Chicken Tikka Masala",
        "description": "Un plat indien classique composé de poulet grillé dans une sauce crémeuse et épicée.",
        "price": 0,
        "difficulty": null,
        "created_by": "a32794ea-34e2-4a9d-9d25-507bccdbfe4c",
        "quantity": 4,
        "number_of_persons": 4,
        "origin_country": "Inde",
        "attributes": [
            "Facile",
            "Spécial",
            "Viande"
        ],
        "process": [
            {
                "name": null,
                "recipe_uuid": null,
                "utensils": [
                    "Poêle",
                    "Casserole",
                    "Mixeur"
                ],
                "ingredients": [
                    {
                        "name": "Poulet",
                        "quantity": 500,
                        "unit": "g"
                    },
                    {
                        "name": "Yaourt grec",
                        "quantity": 150,
                        "unit": "ml"
                    },
                    {
                        "name": "Jus de citron",
                        "quantity": 2,
                        "unit": "cuillères à soupe"
                    },
                    {
                        "name": "Gingembre frais râpé",
                        "quantity": 1,
                        "unit": "cuillère à café"
                    },
                    {
                        "name": "Ail haché",
                        "quantity": 2,
                        "unit": "gousses"
                    },
                    {
                        "name": "Curcuma en poudre",
                        "quantity": 1,
                        "unit": "cuillère à café"
                    },
                    {
                        "name": "Paprika doux",
                        "quantity": 1,
                        "unit": "cuillère à café"
                    },
                    {
                        "name": "Cumin moulu",
                        "quantity": 0.5,
                        "unit": "cuillère à café"
                    },
                    {
                        "name": "Poivre noir moulu",
                        "quantity": 0.5,
                        "unit": "cuillère à café"
                    },
                    {
                        "name": "Sel",
                        "quantity": 1,
                        "unit": "pincée"
                    },
                    {
                        "name": "Huile végétale",
                        "quantity": 2,
                        "unit": "cuillères à soupe"
                    },
                    {
                        "name": "Oignons hachés",
                        "quantity": 1,
                        "unit": "grand"
                    },
                    {
                        "name": "Pâte de tomates",
                        "quantity": 400,
                        "unit": "g"
                    },
                    {
                        "name": "Crème fraîche épaisse",
                        "quantity": 200,
                        "unit": "ml"
                    },
                    {
                        "name": "Coriandre fraîche hachée",
                        "quantity": 1,
                        "unit": "poignée"
                    }
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "description": "Dans un bol, mélanger le poulet avec le yaourt grec, le jus de citron, le gingembre râpé, l'ail haché, le curcuma, le paprika, le cumin et le poivre noir. Saler.",
                        "duration": 900,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                        "title": "mariner le poulet"
                    },
                    {
                        "step_number": 2,
                        "description": "Laisser mariner au réfrigérateur pendant au moins 30 minutes.",
                        "duration": 1800,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                        "title": "laisser mariner"
                    },
                    {
                        "step_number": 3,
                        "description": "Chauffer l'huile végétale dans une poêle à feu moyen-vif. Faire cuire le poulet mariné pendant environ 5 minutes de chaque côté, jusqu'à ce qu'il soit doré et cuit.",
                        "duration": 600,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                        "title": "cuire le poulet"
                    },
                    {
                        "step_number": 4,
                        "description": "Retirer le poulet de la poêle et mettre de côté. Ajouter les oignons hachés dans la même poêle et faire revenir jusqu'à ce qu'ils soient ramollis.",
                        "duration": 300,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                        "title": "faire revenir les oignons"
                    },
                    {
                        "step_number": 5,
                        "description": "Ajouter la pâte de tomates à la poêle et cuire pendant 2-3 minutes, en remuant constamment. Ajouter ensuite la crème fraîche épaisse, le sel et le poivre noir.",
                        "duration": 300,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes
                        "title": "préparer la sauce"
                    },
                    {
                        "step_number": 6,
                        "description": "Remettre le poulet dans la sauce et laisser mijoter pendant 5-10 minutes, jusqu'à ce que la sauce ait épaissi. Garnir de coriandre fraîche hachée avant de servir.",
                        "duration": 900,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    }
                ]
            }
        ],
        "thumbnail_url": null,
        "large_image_url": null,
        "source_reference": "https://bellyfull.net/chicken-tikka-masala/"
    },
    {
        "uuid": "1a3599cc-f661-4af5-8abc-3282248a77c2",
        "name": "Salade d'œufs facile",
        "description": "Une recette simple et délicieuse de salade d'œufs, parfaite pour un déjeuner rapide ou un dîner léger.",
        "price": 0,
        "quantity": 4,
        "difficulty": null,
        "created_by": "a32794ea-34e2-4a9d-9d25-507bccdbfe4c",
        "number_of_persons": 4,
        "origin_country": "États-Unis",
        "attributes": [
            "Facile",
            "Végétarien"
        ],
        "process": [
            {
                "name": null,
                "recipe_uuid": null,
                "utensils": [
                    "Bol",
                    "Fourchette"
                ],
                "ingredients": [
                    {
                        "name": "Oeufs durs",
                        "quantity": 6,
                        "unit": ""
                    },
                    {
                        "name": "Mayonnaise",
                        "quantity": 0.25,
                        "unit": "tasse"
                    },
                    {
                        "name": "Moutarde de Dijon",
                        "quantity": 1,
                        "unit": "cuillère à soupe"
                    },
                    {
                        "name": "Ciboulette fraîche hachée",
                        "quantity": 2,
                        "unit": "cuillères à soupe"
                    },
                    {
                        "name": "Sel",
                        "quantity": 0.25,
                        "unit": "cuillère à café"
                    },
                    {
                        "name": "Poivre noir",
                        "quantity": 0.25,
                        "unit": "cuillère à café"
                    }
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "description": "Faire bouillir les œufs dans de l'eau pendant environ 8 minutes.",
                        "duration": 480,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 2,
                        "description": "Égoutter les œufs et les plonger dans de l'eau froide pour arrêter la cuisson.",
                        "duration": 0,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 3,
                        "description": "Éplucher les œufs durs et les écraser grossièrement dans un bol.",
                        "duration": 0,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 4,
                        "description": "Ajouter la mayonnaise, la moutarde de Dijon, la ciboulette hachée, le sel et le poivre noir. Mélanger jusqu'à ce que tous les ingrédients soient bien combinés.",
                        "duration": 0,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 5,
                        "description": "Couvrir et réfrigérer pendant au moins 30 minutes avant de servir.",
                        "duration": 1800,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    }
                ]
            }
        ],
        "thumbnail_url": null,
        "large_image_url": null,
        "source_reference": "https://bellyfull.net/easy-egg-salad/"
    },
    {
        "uuid": "1ff20e75-fc7a-45b7-95eb-3e2f40fd7c25",
        "name": "ragout de lapin au poivre",
        "description": null,
        "price": null,
        "difficulty": null,
        "quantity": null,
        "number_of_persons": null,
        "origin_country": null,
        "attributes": [],
        "process": [
            {
                "name": null,
                "recipe_uuid": null,
                "utensils": [],
                "ingredients": [],
                "steps": []
            }
        ],
        "thumbnail_url": null,
        "large_image_url": null,
        "source_reference": null,
        "created_by": "d3f48a42-0d1e-4270-8e8e-549251cd823d"
    },
    {
        "uuid": "1ff20e75-fc7a-45b7-95eb-3e2f40fd7d33",
        "name": "ragout de poulet au poivre vert",
        "description": null,
        "price": null,
        "quantity": null,
        "number_of_persons": null,
        "origin_country": null,
        "attributes": [],
        "process": [
            {
                "name": null,
                "recipe_uuid": null,
                "utensils": [],
                "ingredients": [],
                "steps": []
            }
        ],
        "thumbnail_url": null,
        "large_image_url": null,
        "source_reference": null,
        "difficulty": null,
        "created_by": "d3f48a42-0d1e-4270-8e8e-549251cd823d",
    },
    {
        "uuid": "1ff20e75-fc7a-45b7-95eb-3e2f40fd6d43",
        "name": "patte a pizza",
        "description": null,
        "price": null,
        "quantity": null,
        "difficulty": null,
        "number_of_persons": null,
        "origin_country": null,
        "attributes": [],
        "process": [
            {
                "name": null,
                "recipe_uuid": null,
                "utensils": [
                    "petrin",
                    "rouleau"
                ],
                "ingredients": [
                    {
                        "name": "farine",
                        "quantity": 200,
                        "unit": "g"
                    },
                    {
                        "name": "eau",
                        "quantity": 12,
                        "unit": "cl"
                    },
                    {
                        "name": "levure",
                        "quantity": 3,
                        "unit": "g"
                    },
                    {
                        "name": "sel",
                        "quantity": 10,
                        "unit": "g"
                    }
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "description": "pétrir la pâte",
                        "duration": 120,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 2,
                        "description": "faire pousser la pâte",
                        "duration": 1200,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 3,
                        "description": "dégazer et faire les pâtons",
                        "duration": 300,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    }
                ]
            }
        ],
        "thumbnail_url": null,
        "large_image_url": null,
        "source_reference": null,
        "created_by": "d3f48a42-0d1e-4270-8e8e-549251cd823d",
    },
    {
        "uuid": "1ff20e75-fc7a-67b7-95eb-3e2f40fd7d33",
        "name": "pizza hawai",
        "description": null,
        "price": null,
        "difficulty": null,
        "created_by": "a32794ea-34e2-4a9d-9d25-507bccdbfe4c",
        "quantity": null,
        "number_of_persons": null,
        "origin_country": null,
        "attributes": [],
        "process": [
            {
                "recipe_uuid": "1ff20e75-fc7a-45b7-95eb-3e2f40fd6d43",
                "name": null,
                "utensils": [],
                "ingredients": [],
                "steps": []
            },
            {
                "name": "garniture",
                "recipe_uuid": null,
                "utensils": [],
                "ingredients": [
                    {
                        "name": "emincer de poulet",
                        "quantity": 30,
                        "unit": "g"
                    },
                    {
                        "name": "sauce tomate",
                        "quantity": 10,
                        "unit": "cl"
                    },
                    {
                        "name": "fromage rapé",
                        "quantity": 100,
                        "unit": "g"
                    },
                    {
                        "name": "ananas",
                        "quantity": 30,
                        "unit": "g"
                    }
                ],
                "steps": [
                    {
                        "step_number": 1,
                        "description": "étaler la sauce tomate",
                        "duration": 60,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 2,
                        "description": "répartir les ingrédients (sauf le fromage)",
                        "duration": 30,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    },
                    {
                        "step_number": 3,
                        "description": "saupoudrer de fromage",
                        "duration": 30,
                        "cooking_time": 0, // en secondes
                        "rest_time": 0, // en secondes
                        "preparation_time": 0, // en secondes,
                        "title": "mijoter le poulet"
                    }
                ]
            }
        ],
        "thumbnail_url": null,
        "large_image_url": null,
        "source_reference": null
    }
]