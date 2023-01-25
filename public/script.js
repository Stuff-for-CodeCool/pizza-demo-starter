let selectedAllergens = [];
let orders = [];

const allergenContainer = document.querySelector("#allergens");
const pizzaContainer = document.querySelector("#pizza");

const fetcher = async (url) => {
    const req = await fetch("http://localhost:9001/api/" + url);
    const res = await req.json();
    return res;
};

const display = (pizzas, allergens, selected) =>
    pizzas
        .filter(
            (p) =>
                !p.allergens
                    .map((a) => selected.includes(a))
                    .reduce((a, v) => a || v, false)
        )
        .map(
            (pizza) => `
<section class="pizza">
    <h1>${pizza.name}</h1>
    <p>${pizza.ingredients.join(" || ")}</p>
    <p>${pizza.price} moneyz</p>
    <p><strong>WARNING:</strong> contains ${pizza.allergens
        .map((a) => allergens.find((l) => l.id === a)?.name)
        .join(", ")}</p>
    <p><button data-id="${pizza.id}">Add to cart</button></p>
</section>
        `
        )
        .join("");

const orderPizza = async (e) => {
    e.preventDefault();
    const id = parseInt(e.target.dataset.id, 10);
    if (!orders.length || !orders.map((o) => o.id).includes(id)) {
        orders.push({ id: id, amount: 1 });
    } else {
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].id === id) {
                orders[i].amount += 1;
            }
        }
    }

    const req = await fetch("http://localhost:9001/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ order: orders }),
    });
    const res = await req.json();
    console.log(res);
};

const main = async () => {
    const pizza = await fetcher("pizza");
    const allergens = await fetcher("allergens");

    allergenContainer.innerHTML = allergens
        .map(
            (allergen) => `<li>
            <label>
                <input
                    type="checkbox"
                    data-id="${allergen.id}"
                    ${selectedAllergens.includes(allergen.id) ? "checked" : ""}
                />
                ${allergen.name}
            </label>
        </li>`
        )
        .join("");

    allergenContainer
        .querySelectorAll("input[type='checkbox']")
        .forEach((checkbox) =>
            checkbox.addEventListener("change", (e) => {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id, 10);

                if (selectedAllergens.includes(id)) {
                    selectedAllergens = selectedAllergens.filter(
                        (a) => a !== id
                    );
                } else {
                    selectedAllergens = [...selectedAllergens, id];
                }

                pizzaContainer.innerHTML = display(
                    pizza,
                    allergens,
                    selectedAllergens
                );
            })
        );

    pizzaContainer.innerHTML = display(pizza, allergens, selectedAllergens);

    pizzaContainer
        .querySelectorAll("button")
        .forEach((b) => b.addEventListener("click", orderPizza));
};

main();
