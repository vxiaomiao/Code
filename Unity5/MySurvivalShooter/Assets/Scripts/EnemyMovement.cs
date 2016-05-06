using UnityEngine;
using System.Collections;

public class EnemyMovement : MonoBehaviour {

	Transform player;
	NavMeshAgent nav;

	EnemyHealth enemyHealth;
	PlayerHealth playerHealth;

	// Use this for initialization
	void Awake () {
		player = GameObject.FindGameObjectWithTag ("Player").transform;
		nav = GetComponent<NavMeshAgent> ();

		enemyHealth = GetComponent <EnemyHealth> ();
		playerHealth = player.GetComponent <PlayerHealth> ();
	}
	
	// Update is called once per frame
	void Update ()
	{
	
		if (enemyHealth.currentHealth > 0 && playerHealth.currentHealth > 0) {
			nav.SetDestination (player.position);
		} else {
			nav.enabled = false;
		}
	}
}
