using UnityEngine;
using System.Collections;

public class EnemyAttack : MonoBehaviour {

	//攻击时间间隔
	public float timeBetweenAttacks = 0.5f;

	//攻击伤害
	public int attackDamage = 10;

	Animator anima;

	GameObject player;
	PlayerHealth playerHealth;
	EnemyHealth enemyHealth;

	//是否在攻击范围内
	bool IsInRange;

	//计时器
	float timer;

	// Use this for initialization
	void Awake () {
	
		player = GameObject.FindGameObjectWithTag ("Player");
		playerHealth = player.GetComponent <PlayerHealth> ();
		enemyHealth = GetComponent <EnemyHealth> ();
		anima = GetComponent <Animator> ();
	}

	void OnTriggerEnter(Collider other){
	
		//如果触发了触发器的是主角，设置IsInRange为真
		if(other.gameObject == player){
			IsInRange = true;
		}
	}

	void OnTriggerExit(Collider other){

		if (other.gameObject == player){
			IsInRange = false;
		}
	}

	
	// Update is called once per frame
	void Update () {

		//计时器开始计时
		timer += Time.deltaTime;
	
		if( IsInRange && timer >= timeBetweenAttacks && enemyHealth.currentHealth > 0){
			Attact ();			
		}

		if (playerHealth.currentHealth <= 0){
			//播放死亡动画
			anima.SetTrigger ("PlayerDead");
		}
	}

	//怪物攻击
	void Attact (){

		timer = 0f;
		if (playerHealth.currentHealth > 0){
			playerHealth.TakeDamage (attackDamage);
		}
	}
}
