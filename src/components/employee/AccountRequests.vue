<template>
    <section>
      <div class="container">
        <h2 class="title">Account Management</h2>
  
        <div class="columns">
          <!-- Pending Requests -->
          <div class="card">
            <h3>Pending Requests</h3>
            <div v-if="pendingRequests.length">
              <ul class="list-group mt-3">
                <li
                  v-for="request in pendingRequests"
                  :key="request.id"
                  class="list-group-item"
                >
                  <div>
                    <strong>{{ request.name }}</strong><br />
                    <small>Email: {{ request.email }}<br />Telefoon: {{ request.phone }}</small>
                  </div>
                  <div class="button-group mt-2">
                    <button class="btn btn-success btn-sm" @click="approveRequest(request)">
                      Approve
                    </button>
                    <button class="btn btn-danger btn-sm" @click="denyRequest(request)">
                      Deny
                    </button>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else class="mt-3">No pending requests.</div>
          </div>
  
          <!-- Approved Customers -->
          <div class="card approved">
            <h3>Approved Customers</h3>
            <div v-if="approvedCustomers.length">
              <ul>
                <li v-for="(customer, index) in approvedCustomers" :key="index">
                  <strong>{{ customer.name }}</strong><br />
                  <small>Email: {{ customer.email }} | Telephone: {{ customer.phone }}</small>
                  <ul>
                    <li v-for="account in customer.accounts" :key="account.iban">
                      {{ account.type }} Account - IBAN: {{ account.iban }}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div v-else class="mt-3">No approved customers yet.</div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const pendingRequests = ref([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '0612345678' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', phone: '0687654321' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', phone: '0698765432' }
  ])
  
  const approvedCustomers = ref([])
  
  const usedIbans = new Set()
  
  function generateIban() {
    const countryCode = 'NL'
    const bankCode = 'CEBA'
    let iban

    const charToNumber = char =>
        char.toUpperCase().charCodeAt(0) - 55

    // Zet string met letters om naar numerieke string
    const convertLettersToNumbers = str =>
        str.split('').map(char => /[A-Z]/.test(char) ? charToNumber(char) : char).join('')

    do {
        const accountNumber = Math.floor(Math.random() * 1e10).toString().padStart(10, '0')

        const tempIban = bankCode + accountNumber + countryCode + '00'

        const numericIban = convertLettersToNumbers(tempIban)

        const mod97 = numericIban.match(/\d{1,9}/g).reduce((remainder, block) => {
        return Number(BigInt(remainder + block) % 97n)
        }, 0)

        const checkDigits = String(98 - mod97).padStart(2, '0')

        iban = `${countryCode}${checkDigits}${bankCode}${accountNumber}`

    } while (usedIbans.has(iban))

    usedIbans.add(iban)

    // Format IBAN met spaties per 4 tekens
    return iban.match(/.{1,4}/g).join(' ')
    }


  
  function approveRequest(request) {
    const checkingIban = generateIban()
    const savingsIban = generateIban()
  
    approvedCustomers.value.push({
      name: request.name,
      email: request.email,
      phone: request.phone,
      accounts: [
        { type: 'Checking', iban: checkingIban },
        { type: 'Savings', iban: savingsIban }
      ]
    })
  
    pendingRequests.value = pendingRequests.value.filter(r => r.id !== request.id)
  }
  
  function denyRequest(request) {
    const confirmed = window.confirm(`Are you sure you want to deny ${request.name}?`)
    if (confirmed) {
      pendingRequests.value = pendingRequests.value.filter(r => r.id !== request.id)
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: auto;
    padding: 20px;
  }
  
  .title {
    font-size: 26px;
    font-weight: bold;
    color: #6c63ff;
    text-align: center;
    margin-bottom: 30px;
  }
  
  .columns {
    display: flex;
    gap: 30px;
    flex-wrap: wrap;
  }
  
  .card {
    flex: 1;
    min-width: 300px;
    background: #ffffffdd;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card.approved {
    background-color: #f1f9f6;
  }
  
  .list-group-item {
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 0.5rem;
  }
  </style>
  