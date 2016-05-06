using UnityEngine;
using System.Collections;

public class GameOverManager : MonoBehaviour {

	public PlayerHealth playerHealth;

	Animator anima;

	// Use this for initialization
	void Awake () {
	
		anima = GetComponent <Animator> ();
	}
	
	// Update is called once per frame
	void Update () {
	
		if (playerHealth.currentHealth <= 0){
			anima.SetTrigger ("GameOver");
		}

	}
}
