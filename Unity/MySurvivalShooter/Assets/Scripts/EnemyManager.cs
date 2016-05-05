using UnityEngine;
using System.Collections;

public class EnemyManager : MonoBehaviour {

	//changsheng guaiwu qian xuyao dengdai de shijian
	public float waitTime = 5f;

	//shengcheng guaiwu de shijian jiange 
	public float spawnTime = 3f;

	public GameObject enemy;

	public PlayerHealth playerHealth;

	public Transform[] spawnPoints;


	// Use this for initialization
	void Start () {
	
		//mei ge yiding shijian ,diaoyong shengcheng guaiwu hanshu
		InvokeRepeating ("Spawn", waitTime, spawnTime);
	}

	void Spawn(){

		if (playerHealth.currentHealth <= 0f){
			return;
		}

		int pointIndex = Random.Range (0, spawnPoints.Length);

		//shengcheng guaiwu
		Instantiate (enemy, spawnPoints[pointIndex].position, spawnPoints[pointIndex].rotation);	
	}

	// Update is called once per frame
	void Update () {
	
	}
}
