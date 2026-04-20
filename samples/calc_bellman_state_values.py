def calculate_bellman_values(alpha, beta, gamma, R_search, R_wait, threshold=1e-6):
    """
    Calculates the optimal state-value functions for the Recycling Robot
    and counts iterations to convergence.
    """
    # Initialize values for [High, Low]
    V = [0.0, 0.0]
    iterations = 0
    
    while True:
        iterations += 1
        V_old = V[:]
        
        # --- State: HIGH ---
        # Action: Search
        v_high_search = alpha * (R_search + gamma * V_old[0]) + \
                        (1 - alpha) * (R_search + gamma * V_old[1])
        
        # Action: Wait
        v_high_wait = R_wait + gamma * V_old[0]
        
        V[0] = max(v_high_search, v_high_wait)
        
        # --- State: LOW ---
        # Action: Search
        # Penalty for depleting battery is often -3 in literature (Sutton & Barto)
        penalty = -3 
        v_low_search = beta * (R_search + gamma * V_old[1]) + \
                       (1 - beta) * (penalty + gamma * V_old[0])
        
        # Action: Wait
        v_low_wait = R_wait + gamma * V_old[1]
        
        # Action: Recharge
        v_low_recharge = 0 + gamma * V_old[0]
        
        V[1] = max(v_low_search, v_low_wait, v_low_recharge)
        
        # Check convergence: check if the change is smaller than threshold
        diff = max(abs(V[0] - V_old[0]), abs(V[1] - V_old[1]))
        if diff < threshold:
            break
            
    return {
        "V_High": round(V[0], 4), 
        "V_Low": round(V[1], 4), 
        "iterations": iterations
    }

# Example Usage:
params = {
    "alpha": 0.8,
    "beta": 0.6,
    "gamma": 0.9,
    "R_search": 2.0,
    "R_wait": 1.0
}

results = calculate_bellman_values(**params)

print(f"Optimal Values: High = {results['V_High']}, Low = {results['V_Low']}")
print(f"Number of iterations to converge: {results['iterations']}")
